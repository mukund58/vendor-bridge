using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1")]
[Authorize]
public class QuotationController : ControllerBase
{
    private readonly IQuotationService _quotationService;

    public QuotationController(IQuotationService quotationService)
    {
        _quotationService = quotationService;
    }

    // Role VENDOR submits a quotation
    [HttpPost("quotations")]
    public async Task<IActionResult> SubmitQuotation([FromBody] SubmitQuotationDto dto)
    {
        // For hackathon simplicity, we assume the User ID in JWT corresponds to a Vendor record if the role is VENDOR.
        // In a real system, you'd have a mapping. Let's assume User.Id matches Vendor.Id for simplicity here or fetch from service.
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var quotation = await _quotationService.SubmitQuotationAsync(dto, userId);
        if (quotation == null) return BadRequest(new { message = "Could not submit quotation. Ensure RFQ is Published and you are an invited vendor." });
        
        return CreatedAtAction(nameof(GetQuotation), new { id = quotation.Id }, quotation);
    }

    [HttpGet("quotations/{id}")]
    public async Task<IActionResult> GetQuotation(int id)
    {
        var quotation = await _quotationService.GetQuotationByIdAsync(id);
        if (quotation == null) return NotFound();
        return Ok(quotation);
    }

    [HttpGet("vendor/quotations")]
    public async Task<IActionResult> GetMyQuotations()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var quotations = await _quotationService.GetVendorQuotationsAsync(userId);
        return Ok(quotations);
    }

    [HttpGet("vendor/rfqs")]
    public async Task<IActionResult> GetAvailableRFQs()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var rfqs = await _quotationService.GetAvailableRFQsForVendorAsync(userId);
        return Ok(rfqs);
    }
}