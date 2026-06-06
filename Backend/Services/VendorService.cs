using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IVendorService
{
    Task<IEnumerable<VendorDto>> GetVendorsAsync(string? status, string? search);
    Task<VendorDto?> GetVendorByIdAsync(int id);
    Task<VendorDto> CreateVendorAsync(CreateVendorDto dto);
    Task<VendorDto?> UpdateVendorAsync(int id, CreateVendorDto dto);
    Task<bool> UpdateVendorStatusAsync(int id, string status);
}

public class VendorService : IVendorService
{
    private readonly AppDbContext _context;

    public VendorService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VendorDto>> GetVendorsAsync(string? status, string? search)
    {
        var query = _context.Vendors.AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<VendorStatus>(status, true, out var statusEnum))
        {
            query = query.Where(v => v.Status == statusEnum);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(v => v.CompanyName.Contains(search) || 
                                     v.Category.Contains(search) || 
                                     v.ContactPerson.Contains(search));
        }

        return await query.Select(v => MapToDto(v)).ToListAsync();
    }

    public async Task<VendorDto?> GetVendorByIdAsync(int id)
    {
        var vendor = await _context.Vendors.FindAsync(id);
        return vendor == null ? null : MapToDto(vendor);
    }

    public async Task<VendorDto> CreateVendorAsync(CreateVendorDto dto)
    {
        var vendor = new Vendor
        {
            CompanyName = dto.CompanyName,
            GstNumber = dto.GstNumber,
            Category = dto.Category,
            ContactPerson = dto.ContactPerson,
            Email = dto.Email,
            Phone = dto.Phone,
            Status = VendorStatus.ACTIVE,
            Rating = dto.Rating
        };

        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();

        return MapToDto(vendor);
    }

    public async Task<VendorDto?> UpdateVendorAsync(int id, CreateVendorDto dto)
    {
        var vendor = await _context.Vendors.FindAsync(id);
        if (vendor == null) return null;

        vendor.CompanyName = dto.CompanyName;
        vendor.GstNumber = dto.GstNumber;
        vendor.Category = dto.Category;
        vendor.ContactPerson = dto.ContactPerson;
        vendor.Email = dto.Email;
        vendor.Phone = dto.Phone;
        vendor.Rating = dto.Rating;

        await _context.SaveChangesAsync();
        return MapToDto(vendor);
    }

    public async Task<bool> UpdateVendorStatusAsync(int id, string status)
    {
        var vendor = await _context.Vendors.FindAsync(id);
        if (vendor == null) return false;

        if (Enum.TryParse<VendorStatus>(status, true, out var statusEnum))
        {
            vendor.Status = statusEnum;
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }

    private static VendorDto MapToDto(Vendor v) => new VendorDto
    {
        Id = v.Id,
        CompanyName = v.CompanyName,
        GstNumber = v.GstNumber,
        Category = v.Category,
        ContactPerson = v.ContactPerson,
        Email = v.Email,
        Phone = v.Phone,
        Status = v.Status.ToString(),
        Rating = v.Rating
    };
}