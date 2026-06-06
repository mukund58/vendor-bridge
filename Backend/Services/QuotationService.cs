using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IQuotationService
{
    Task<QuotationDto?> SubmitQuotationAsync(SubmitQuotationDto dto, int vendorId);
    Task<IEnumerable<QuotationDto>> GetVendorQuotationsAsync(int vendorId);
    Task<QuotationDto?> GetQuotationByIdAsync(int id);
    Task<IEnumerable<RFQDto>> GetAvailableRFQsForVendorAsync(int vendorId);
}

public class QuotationService : IQuotationService
{
    private readonly AppDbContext _context;
    private readonly IActivityLogService _activityLogService;

    public QuotationService(AppDbContext context, IActivityLogService activityLogService)
    {
        _context = context;
        _activityLogService = activityLogService;
    }

    public async Task<QuotationDto?> SubmitQuotationAsync(SubmitQuotationDto dto, int vendorId)
    {
        var rfq = await _context.RFQs
            .Include(r => r.RFQVendors)
            .Include(r => r.Items)
            .FirstOrDefaultAsync(r => r.Id == dto.RFQId);

        if (rfq == null || (rfq.Status != RFQStatus.Published && rfq.Status != RFQStatus.QuotationReceived)) return null;
        if (!rfq.RFQVendors.Any(v => v.VendorId == vendorId)) return null;

        var quotation = new Quotation
        {
            RFQId = dto.RFQId,
            VendorId = vendorId,
            GstPercentage = dto.GstPercentage,
            Notes = dto.Notes,
            Status = QuotationStatus.Submitted,
            Items = dto.Items.Select(i => new QuotationItem
            {
                RFQItemId = i.ItemId,
                UnitPrice = i.UnitPrice,
                DeliveryDays = i.DeliveryDays
            }).ToList()
        };

        // Calculate totals and basic info
        quotation.TotalPrice = quotation.Items.Sum(i => i.UnitPrice * (decimal)(rfq.Items.FirstOrDefault(ri => ri.Id == i.RFQItemId)?.Quantity ?? 0));
        quotation.TotalPrice += quotation.TotalPrice * (dto.GstPercentage / 100);
        quotation.DeliveryDays = quotation.Items.Max(i => i.DeliveryDays);

        _context.Quotations.Add(quotation);
        
        // Update RFQ Status if it's the first quotation
        if (rfq.Status == RFQStatus.Published)
        {
            rfq.Status = RFQStatus.QuotationReceived;
        }

        await _context.SaveChangesAsync();

        try
        {
            await _activityLogService.LogActivityAsync(null, $"Quotation Submitted for {rfq.Title}", "RFQ", quotation.Id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to log quotation submission: {ex.Message}");
        }

        return await GetQuotationByIdAsync(quotation.Id);
    }

    public async Task<IEnumerable<QuotationDto>> GetVendorQuotationsAsync(int vendorId)
    {
        var quotations = await _context.Quotations
            .Include(q => q.Vendor)
            .Include(q => q.Items)
            .ThenInclude(qi => qi.RFQItem)
            .Where(q => q.VendorId == vendorId)
            .ToListAsync();

        return quotations.Select(MapToDto);
    }

    public async Task<QuotationDto?> GetQuotationByIdAsync(int id)
    {
        var q = await _context.Quotations
            .Include(q => q.Vendor)
            .Include(q => q.Items)
            .ThenInclude(qi => qi.RFQItem)
            .FirstOrDefaultAsync(q => q.Id == id);

        return q == null ? null : MapToDto(q);
    }

    public async Task<IEnumerable<RFQDto>> GetAvailableRFQsForVendorAsync(int vendorId)
    {
        var rfqs = await _context.RFQs
            .Include(r => r.Items)
            .Include(r => r.RFQVendors)
            .Where(r => r.Status == RFQStatus.Published && r.RFQVendors.Any(rv => rv.VendorId == vendorId))
            .ToListAsync();

        return rfqs.Select(r => new RFQDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Deadline = r.Deadline,
            Status = r.Status.ToString(),
            Items = r.Items.Select(i => new RFQItemDto
            {
                Id = i.Id,
                ItemName = i.ItemName,
                Quantity = i.Quantity,
                Unit = i.Unit
            }).ToList()
        });
    }

    private static QuotationDto MapToDto(Quotation q) => new QuotationDto
    {
        Id = q.Id,
        RFQId = q.RFQId,
        VendorId = q.VendorId,
        VendorName = q.Vendor?.CompanyName ?? "Unknown",
        TotalPrice = q.TotalPrice,
        DeliveryDays = q.DeliveryDays,
        Status = q.Status.ToString(),
        SubmittedAt = q.SubmittedAt,
        Items = q.Items.Select(i => new QuotationItemDto
        {
            Id = i.Id,
            ItemName = i.RFQItem?.ItemName ?? "Unknown",
            UnitPrice = i.UnitPrice,
            DeliveryDays = i.DeliveryDays
        }).ToList()
    };
}