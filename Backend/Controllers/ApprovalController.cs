using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/approvals")]
[Authorize]
public class ApprovalController : ControllerBase
{
    private readonly IApprovalService _approvalService;

    public ApprovalController(IApprovalService approvalService)
    {
        _approvalService = approvalService;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingApprovals()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role != "MANAGER" && role != "ADMIN")
            return Forbid();

        var pending = await _approvalService.GetPendingApprovalsAsync();
        return Ok(pending);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetApproval(int id)
    {
        var approval = await _approvalService.GetApprovalByIdAsync(id);
        if (approval == null) return NotFound();
        return Ok(approval);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveApproval(int id, [FromBody] ApproveRejectDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        var result = await _approvalService.ApproveApprovalAsync(id, dto, userId, role);
        if (!result) return BadRequest(new { message = "Could not approve. Ensure the approval is in a valid state and you have the appropriate permissions." });

        return Ok(new { success = true });
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectApproval(int id, [FromBody] ApproveRejectDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        var result = await _approvalService.RejectApprovalAsync(id, dto, userId, role);
        if (!result) return BadRequest(new { message = "Could not reject. Ensure the approval is in a valid state and you have the appropriate permissions." });

        return Ok(new { success = true });
    }
}
