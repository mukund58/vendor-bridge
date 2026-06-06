using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IInvoiceService
{
    Task<InvoiceDto?> CreateInvoiceFromPOAsync(int purchaseOrderId);
    Task<IEnumerable<InvoiceDto>> GetInvoicesAsync();
    Task<InvoiceDto?> GetInvoiceByIdAsync(int id);
    Task<bool> MarkAsPaidAsync(int id);
}

public class InvoiceService : IInvoiceService
{
    private readonly AppDbContext _context;
    private readonly IPONumberGenerator _poNumberGenerator;
    private readonly IActivityLogService _activityLogService;

    public InvoiceService(AppDbContext context, IPONumberGenerator poNumberGenerator, IActivityLogService activityLogService)
    {
        _context = context;
        _poNumberGenerator = poNumberGenerator;
        _activityLogService = activityLogService;
    }

    public async Task<InvoiceDto?> CreateInvoiceFromPOAsync(int purchaseOrderId)
    {
        var po = await _context.PurchaseOrders
            .Include(p => p.Vendor)
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == purchaseOrderId);

        if (po == null) return null;

        // Check if invoice already exists
        var existingInvoice = await _context.Invoices
            .Include(i => i.Vendor)
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.PurchaseOrderId == purchaseOrderId);

        if (existingInvoice != null)
        {
            return MapToDto(existingInvoice);
        }

        var invoiceNumber = await _poNumberGenerator.GenerateInvoiceNumberAsync();

        // Match frontend tax/subtotal calculation: sub = total / 1.18; tax = total - sub;
        decimal totalAmount = po.TotalPrice;
        decimal subtotal = Math.Round(totalAmount / 1.18m, 2);
        decimal taxAmount = totalAmount - subtotal;

        var invoice = new Invoice
        {
            InvoiceNumber = invoiceNumber,
            PurchaseOrderId = po.Id,
            VendorId = po.VendorId,
            Subtotal = subtotal,
            TaxAmount = taxAmount,
            TotalAmount = totalAmount,
            Status = InvoiceStatus.PENDING_PAYMENT,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var item in po.Items)
        {
            invoice.Items.Add(new InvoiceItem
            {
                ItemName = item.ItemName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice
            });
        }

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        // Fetch again to ensure everything is populated correctly
        var savedInvoice = await _context.Invoices
            .Include(i => i.Vendor)
            .Include(i => i.Items)
            .FirstAsync(i => i.Id == invoice.Id);

        return MapToDto(savedInvoice);
    }

    public async Task<IEnumerable<InvoiceDto>> GetInvoicesAsync()
    {
        var invoices = await _context.Invoices
            .Include(i => i.Vendor)
            .Include(i => i.Items)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return invoices.Select(MapToDto);
    }

    public async Task<InvoiceDto?> GetInvoiceByIdAsync(int id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Vendor)
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id);

        return invoice == null ? null : MapToDto(invoice);
    }

    public async Task<bool> MarkAsPaidAsync(int id)
    {
        var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
        if (invoice == null) return false;

        invoice.Status = InvoiceStatus.PAID;
        await _context.SaveChangesAsync();

        try
        {
            await _activityLogService.LogActivityAsync(null, $"Invoice {invoice.InvoiceNumber} marked Paid in ledger", "INVOICE", invoice.Id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to log invoice paid: {ex.Message}");
        }

        return true;
    }

    private static InvoiceDto MapToDto(Invoice inv) => new InvoiceDto
    {
        Id = inv.Id,
        InvoiceNumber = inv.InvoiceNumber,
        PurchaseOrderId = inv.PurchaseOrderId,
        VendorId = inv.VendorId,
        VendorName = inv.Vendor?.CompanyName ?? "Unknown Vendor",
        Subtotal = inv.Subtotal,
        TaxAmount = inv.TaxAmount,
        TotalAmount = inv.TotalAmount,
        Status = inv.Status == InvoiceStatus.PAID ? "PAID" : "UNPAID",
        CreatedAt = inv.CreatedAt,
        Items = inv.Items.Select(i => new InvoiceItemDto
        {
            Id = i.Id,
            InvoiceId = i.InvoiceId,
            ItemName = i.ItemName,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            TotalPrice = i.TotalPrice
        }).ToList()
    };
}
