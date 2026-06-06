using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IRFQService
{
    Task<RFQDto> CreateRFQAsync(CreateRFQDto dto, int userId);
    Task<IEnumerable<RFQDto>> GetRFQsAsync();
    Task<RFQDto?> GetRFQByIdAsync(int id);
    Task<bool> PublishRFQAsync(int id);
    Task<RFQComparisonDto?> GetRFQComparisonAsync(int id);
}

public class RFQService : IRFQService
{
    private readonly AppDbContext _context;

    public RFQService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RFQDto> CreateRFQAsync(CreateRFQDto dto, int userId)
    {
        var rfq = new RFQ
        {
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            CreatedById = userId,
            Status = RFQStatus.Draft,
            Items = dto.Items.Select(i => new RFQItem
            {
                ItemName = i.ItemName,
                Quantity = i.Quantity,
                Unit = i.Unit
            }).ToList(),
            RFQVendors = dto.Vendors.Select(vId => new RFQVendor
            {
                VendorId = vId
            }).ToList()
        };

        _context.RFQs.Add(rfq);
        await _context.SaveChangesAsync();

        return MapToDto(rfq);
    }

    public async Task<IEnumerable<RFQDto>> GetRFQsAsync()
    {
        var rfqs = await _context.RFQs
            .Include(r => r.Items)
            .Include(r => r.RFQVendors)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return rfqs.Select(MapToDto);
    }

    public async Task<RFQDto?> GetRFQByIdAsync(int id)
    {
        var rfq = await _context.RFQs
            .Include(r => r.Items)
            .Include(r => r.RFQVendors)
            .FirstOrDefaultAsync(r => r.Id == id);

        return rfq == null ? null : MapToDto(rfq);
    }

    public async Task<bool> PublishRFQAsync(int id)
    {
        var rfq = await _context.RFQs.FindAsync(id);
        if (rfq == null || rfq.Status != RFQStatus.Draft) return false;

        rfq.Status = RFQStatus.Published;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<RFQComparisonDto?> GetRFQComparisonAsync(int id)
    {
        var rfq = await _context.RFQs.FindAsync(id);
        if (rfq == null) return null;

        var quotations = await _context.Quotations
            .Include(q => q.Vendor)
            .Where(q => q.RFQId == id)
            .ToListAsync();

        var comparisonDto = new RFQComparisonDto
        {
            RfqId = id
        };

        if (!quotations.Any())
        {
            return comparisonDto;
        }

        var lowestPrice = quotations.Min(q => q.TotalPrice);
        var fastestDelivery = quotations.Min(q => q.DeliveryDays);

        comparisonDto.Quotations = quotations.Select(q => new QuotationComparisonDto
        {
            QuotationId = q.Id,
            Vendor = q.Vendor?.CompanyName ?? "Unknown",
            Amount = q.TotalPrice,
            DeliveryDays = q.DeliveryDays,
            Rating = q.Vendor?.Rating ?? 4.0,
            IsLowestPrice = q.TotalPrice == lowestPrice,
            IsFastestDelivery = q.DeliveryDays == fastestDelivery
        }).ToList();

        var maxPrice = quotations.Max(q => q.TotalPrice);
        var minPrice = lowestPrice;
        var maxDelivery = quotations.Max(q => q.DeliveryDays);
        var minDelivery = fastestDelivery;

        QuotationComparisonDto? bestQuote = null;
        double highestScore = -1.0;

        foreach (var qDto in comparisonDto.Quotations)
        {
            double priceScore = maxPrice == minPrice ? 1.0 : (double)((maxPrice - qDto.Amount) / (maxPrice - minPrice));
            double deliveryScore = maxDelivery == minDelivery ? 1.0 : (double)(maxDelivery - qDto.DeliveryDays) / (maxDelivery - minDelivery);
            double ratingScore = qDto.Rating / 5.0;

            double totalScore = (priceScore * 0.5) + (deliveryScore * 0.3) + (ratingScore * 0.2);

            if (totalScore > highestScore)
            {
                highestScore = totalScore;
                bestQuote = qDto;
            }
        }

        if (bestQuote != null)
        {
            comparisonDto.WinnerSuggestion = bestQuote.Vendor;
            comparisonDto.LowestPrice = bestQuote.IsLowestPrice;
        }

        return comparisonDto;
    }

    private static RFQDto MapToDto(RFQ rfq) => new RFQDto
    {
        Id = rfq.Id,
        Title = rfq.Title,
        Description = rfq.Description,
        Deadline = rfq.Deadline,
        Status = rfq.Status.ToString(),
        Items = rfq.Items.Select(i => new RFQItemDto
        {
            Id = i.Id,
            ItemName = i.ItemName,
            Quantity = i.Quantity,
            Unit = i.Unit
        }).ToList(),
        VendorIds = rfq.RFQVendors.Select(rv => rv.VendorId).ToList()
    };
}