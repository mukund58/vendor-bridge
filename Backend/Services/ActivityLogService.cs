using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Backend.Services;

public interface IActivityLogService
{
    Task LogActivityAsync(int? userId, string action, string entityType, int? entityId);
    Task<IEnumerable<ActivityLogDto>> GetActivitiesAsync(string? type);
}

public class ActivityLogService : IActivityLogService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ActivityLogService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogActivityAsync(int? userId, string action, string entityType, int? entityId)
    {
        if (userId == null)
        {
            try
            {
                var httpContext = _httpContextAccessor?.HttpContext;
                var claimValue = httpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                if (claimValue != null && int.TryParse(claimValue, out var parsedId))
                {
                    userId = parsedId;
                }
            }
            catch
            {
                // Fallback silently if not in HTTP context (e.g. background threads or startup)
            }
        }

        // Enforce valid entityType matching frontend expected uppercase strings
        var formattedType = entityType.ToUpper().Trim();
        if (formattedType == "PO") formattedType = "PURCHASE ORDER";

        var log = new ActivityLog
        {
            UserId = userId,
            Action = action,
            EntityType = formattedType,
            EntityId = entityId,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActivityLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ActivityLogDto>> GetActivitiesAsync(string? type)
    {
        // Check if database needs seeding of initial audit logs
        await SeedMockActivitiesIfEmptyAsync();

        var query = _context.ActivityLogs
            .Include(a => a.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(type) && type.ToUpper() != "ALL")
        {
            var formattedType = type.ToUpper().Trim();
            if (formattedType == "PO") formattedType = "PURCHASE ORDER";
            query = query.Where(a => a.EntityType == formattedType);
        }

        var logs = await query
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return logs.Select(MapToDto);
    }

    private ActivityLogDto MapToDto(ActivityLog log)
    {
        // Determine status based on action keywords
        string status = "SUCCESS";
        var actionLower = log.Action.ToLower();
        if (actionLower.Contains("reject") || actionLower.Contains("fail") || actionLower.Contains("cancel") || actionLower.Contains("danger"))
        {
            status = "DANGER";
        }
        else if (actionLower.Contains("pending") || actionLower.Contains("warning") || actionLower.Contains("review"))
        {
            status = "WARNING";
        }

        return new ActivityLogDto
        {
            Id = log.Id,
            Action = log.Action,
            Timestamp = log.CreatedAt,
            Type = log.EntityType,
            Status = status,
            User = log.User?.Name ?? "System Agent"
        };
    }

    private async Task SeedMockActivitiesIfEmptyAsync()
    {
        if (await _context.ActivityLogs.AnyAsync()) return;

        // Seed some initial mock activity logs matching frontend mock records
        var mockLogs = new List<ActivityLog>
        {
            new() { Action = "RFQ Published for Raw Steel Sheet Coils", EntityType = "RFQ", CreatedAt = DateTime.UtcNow.AddHours(-3) },
            new() { Action = "Approval Pending for Cloud Infrastructure PO", EntityType = "APPROVAL", CreatedAt = DateTime.UtcNow.AddHours(-5) },
            new() { Action = "PO PO-2026-1029 generated for Stark Industries", EntityType = "PURCHASE ORDER", CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new() { Action = "Invoice INV-2026-7791 marked Paid in ledger", EntityType = "INVOICE", CreatedAt = DateTime.UtcNow.AddDays(-1).AddHours(-3) },
            new() { Action = "RFQ QTN-4170 rejected due to compliance score variance", EntityType = "RFQ", CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new() { Action = "New Supplier Apex Metals onboarded", EntityType = "APPROVAL", CreatedAt = DateTime.UtcNow.AddDays(-3) },
            new() { Action = "Draft PO PO-2026-1026 cancelled due to budget cuts", EntityType = "PURCHASE ORDER", CreatedAt = DateTime.UtcNow.AddDays(-12) }
        };

        _context.ActivityLogs.AddRange(mockLogs);
        await _context.SaveChangesAsync();
    }
}
