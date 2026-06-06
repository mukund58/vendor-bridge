using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/rfqs")]
[Authorize]
public class RFQController : ControllerBase
{
    private readonly IRFQService _rfqService;

    public RFQController(IRFQService rfqService)
    {
        _rfqService = rfqService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRFQ([FromBody] CreateRFQDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var rfq = await _rfqService.CreateRFQAsync(dto, userId);
        return CreatedAtAction(nameof(GetRFQ), new { id = rfq.Id }, rfq);
    }

    [HttpGet]
    public async Task<IActionResult> GetRFQs()
    {
        var rfqs = await _rfqService.GetRFQsAsync();
        return Ok(rfqs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRFQ(int id)
    {
        var rfq = await _rfqService.GetRFQByIdAsync(id);
        if (rfq == null) return NotFound();
        return Ok(rfq);
    }

    [HttpPost("{id}/publish")]
    public async Task<IActionResult> PublishRFQ(int id)
    {
        var result = await _rfqService.PublishRFQAsync(id);
        if (!result) return BadRequest(new { message = "Could not publish RFQ. Ensure it exists and is in Draft status." });
        return NoContent();
    }

    [HttpGet("{id}/comparison")]
    public async Task<IActionResult> GetRFQComparison(int id)
    {
        var comparison = await _rfqService.GetRFQComparisonAsync(id);
        if (comparison == null) return NotFound();
        return Ok(comparison);
    }
}