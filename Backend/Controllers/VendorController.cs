using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/vendors")]
[Authorize] // Most vendor management should be protected
public class VendorController : ControllerBase
{
    private readonly IVendorService _vendorService;

    public VendorController(IVendorService vendorService)
    {
        _vendorService = vendorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVendors([FromQuery] string? status, [FromQuery] string? search)
    {
        var vendors = await _vendorService.GetVendorsAsync(status, search);
        return Ok(vendors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVendor(int id)
    {
        var vendor = await _vendorService.GetVendorByIdAsync(id);
        if (vendor == null) return NotFound();
        return Ok(vendor);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVendor([FromBody] CreateVendorDto dto)
    {
        var vendor = await _vendorService.CreateVendorAsync(dto);
        return CreatedAtAction(nameof(GetVendor), new { id = vendor.Id }, vendor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVendor(int id, [FromBody] CreateVendorDto dto)
    {
        var vendor = await _vendorService.UpdateVendorAsync(id, dto);
        if (vendor == null) return NotFound();
        return Ok(vendor);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateVendorStatusDto dto)
    {
        var result = await _vendorService.UpdateVendorStatusAsync(id, dto.Status);
        if (!result) return BadRequest(new { message = "Invalid status or vendor not found" });
        return NoContent();
    }
}