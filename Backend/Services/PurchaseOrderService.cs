using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IPurchaseOrderService
{
    Task<PurchaseOrderDto?> CreatePOFromQuotationAsync(int quotationId);
    Task<IEnumerable<PurchaseOrderDto>> GetPurchaseOrdersAsync();
    Task<PurchaseOrderDto?> GetPurchaseOrderByIdAsync(int id);
}

public class PurchaseOrderService : IPurchaseOrderService
{
    private readonly AppDbContext _context;
    private readonly IPONumberGenerator _poNumberGenerator;
    private readonly IInvoiceService _invoiceService;
    private readonly IActivityLogService _activityLogService;

    public PurchaseOrderService(AppDbContext context, IPONumberGenerator poNumberGenerator, IInvoiceService invoiceService, IActivityLogService activityLogService)
    {
        _context = context;
        _poNumberGenerator = poNumberGenerator;
        _invoiceService = invoiceService;
        _activityLogService = activityLogService;
    }

    public async Task<PurchaseOrderDto?> CreatePOFromQuotationAsync(int quotationId)
    {
        var quotation = await _context.Quotations
            .Include(q => q.Vendor)
            .Include(q => q.Items)
                .ThenInclude(qi => qi.RFQItem)
            .FirstOrDefaultAsync(q => q.Id == quotationId);

        if (quotation == null) return null;

        // Check if PO already exists
        var existingPO = await _context.PurchaseOrders
            .Include(po => po.Vendor)
            .Include(po => po.Items)
            .FirstOrDefaultAsync(po => po.QuotationId == quotationId);

        if (existingPO != null)
        {
            return MapToDto(existingPO);
        }

        var poNumber = await _poNumberGenerator.GeneratePONumberAsync();

        var po = new PurchaseOrder
        {
            PONumber = poNumber,
            RFQId = quotation.RFQId,
            QuotationId = quotation.Id,
            VendorId = quotation.VendorId,
            TotalPrice = quotation.TotalPrice,
            DeliveryDays = quotation.DeliveryDays,
            Status = "ACKNOWLEDGED",
            CreatedAt = DateTime.UtcNow
        };

        foreach (var item in quotation.Items)
        {
            var quantity = item.RFQItem?.Quantity ?? 1.0;
            po.Items.Add(new PurchaseOrderItem
            {
                RFQItemId = item.RFQItemId,
                ItemName = item.RFQItem?.ItemName ?? "Unknown Item",
                Quantity = quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.UnitPrice * (decimal)quantity
            });
        }

        _context.PurchaseOrders.Add(po);
        await _context.SaveChangesAsync();

        try
        {
            var vendorName = quotation.Vendor?.CompanyName ?? "Supplier";
            await _activityLogService.LogActivityAsync(null, $"PO {po.PONumber} generated for {vendorName}", "PURCHASE ORDER", po.Id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to log PO generation: {ex.Message}");
        }

        // Update quotation status if not already selected
        if (quotation.Status != QuotationStatus.Selected)
        {
            quotation.Status = QuotationStatus.Selected;
            await _context.SaveChangesAsync();
        }

        // Trigger Auto-Invoice Generation
        try
        {
            await _invoiceService.CreateInvoiceFromPOAsync(po.Id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to auto-generate invoice: {ex.Message}");
        }

        // Fetch again to ensure everything is populated correctly
        var savedPO = await _context.PurchaseOrders
            .Include(p => p.Vendor)
            .Include(p => p.Items)
            .FirstAsync(p => p.Id == po.Id);

        return MapToDto(savedPO);
    }

    public async Task<IEnumerable<PurchaseOrderDto>> GetPurchaseOrdersAsync()
    {
        var pos = await _context.PurchaseOrders
            .Include(po => po.Vendor)
            .Include(po => po.Items)
            .OrderByDescending(po => po.CreatedAt)
            .ToListAsync();

        return pos.Select(MapToDto);
    }

    public async Task<PurchaseOrderDto?> GetPurchaseOrderByIdAsync(int id)
    {
        var po = await _context.PurchaseOrders
            .Include(po => po.Vendor)
            .Include(po => po.Items)
            .FirstOrDefaultAsync(po => po.Id == id);

        return po == null ? null : MapToDto(po);
    }

    private static PurchaseOrderDto MapToDto(PurchaseOrder po) => new PurchaseOrderDto
    {
        Id = po.Id,
        PONumber = po.PONumber,
        RFQId = po.RFQId,
        QuotationId = po.QuotationId,
        VendorId = po.VendorId,
        VendorName = po.Vendor?.CompanyName ?? "Unknown Vendor",
        TotalPrice = po.TotalPrice,
        DeliveryDays = po.DeliveryDays,
        Status = po.Status,
        CreatedAt = po.CreatedAt,
        Items = po.Items.Select(i => new PurchaseOrderItemDto
        {
            Id = i.Id,
            PurchaseOrderId = i.PurchaseOrderId,
            RFQItemId = i.RFQItemId,
            ItemName = i.ItemName,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            TotalPrice = i.TotalPrice
        }).ToList()
    };
}
