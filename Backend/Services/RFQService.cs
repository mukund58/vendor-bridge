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