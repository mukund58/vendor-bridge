using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IDashboardService
{
    Task<DashboardPayloadDto> GetDashboardPayloadAsync();
}

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly IReportService _reportService;

    public DashboardService(AppDbContext context, IReportService reportService)
    {
        _context = context;
        _reportService = reportService;
    }

    public async Task<DashboardPayloadDto> GetDashboardPayloadAsync()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

        // 1. Active RFQs count
        var activeRfqsCount = await _context.RFQs.CountAsync(r => r.Status == RFQStatus.Published || r.Status == RFQStatus.QuotationReceived || r.Status == RFQStatus.UnderReview);

        // 2. Pending Approvals count
        var pendingApprovalsCount = await _context.Approvals.CountAsync(a => a.Status == ApprovalStatus.PENDING || a.Status == ApprovalStatus.L1_APPROVED);

        // 3. Monthly Spend
        var monthlySpend = await _context.Invoices
            .Where(i => i.Status != InvoiceStatus.DRAFT && i.CreatedAt >= startOfMonth && i.CreatedAt <= endOfMonth)
            .SumAsync(i => i.TotalAmount);

        // 4. Overdue Invoices count
        var overdueInvoicesCount = await _context.Invoices.CountAsync(i => i.Status == InvoiceStatus.OVERDUE);

        // 5. Recent POs
        var recentPOs = await _context.PurchaseOrders
            .Include(po => po.Vendor)
            .OrderByDescending(po => po.CreatedAt)
            .Take(4)
            .Select(po => new DashboardPoDto
            {
                Id = po.Id,
                Po_number = po.PONumber,
                Vendor_name = po.Vendor != null ? po.Vendor.CompanyName : "Unknown Vendor",
                Amount = po.TotalPrice,
                Created_at = po.CreatedAt,
                Status = po.Status
            })
            .ToListAsync();

        // 6. Recent RFQs list
        var recentRFQsList = await _context.RFQs
            .OrderByDescending(r => r.CreatedAt)
            .Take(3)
            .ToListAsync();

        var dashboardRfqs = new List<DashboardRfqDto>();
        foreach (var r in recentRFQsList)
        {
            var submissionsCount = await _context.Quotations.CountAsync(q => q.RFQId == r.Id);
            dashboardRfqs.Add(new DashboardRfqDto
            {
                Id = r.Id,
                Title = r.Title,
                Category = r.Title.Contains("Material") || r.Title.Contains("Steel") ? "Raw Materials" : "Supplies",
                Description = r.Description,
                Deadline = r.Deadline,
                Submissions = submissionsCount,
                Status = r.Status == RFQStatus.Draft ? "Draft" : (r.Status == RFQStatus.Published ? "Active" : "Pending Review")
            });
        }

        // 7. Pending Approvals list
        var pendingApprovalsList = await _context.Approvals
            .Include(a => a.RFQ)
                .ThenInclude(r => r.CreatedBy)
            .Include(a => a.Quotation)
                .ThenInclude(q => q.Vendor)
            .Where(a => a.Status == ApprovalStatus.PENDING || a.Status == ApprovalStatus.L1_APPROVED)
            .OrderByDescending(a => a.CreatedAt)
            .Take(3)
            .Select(a => new DashboardApprovalDto
            {
                Id = a.Id,
                Type = "Purchase Order",
                Subject = a.RFQ != null ? a.RFQ.Title : "Server Infrastructure Migration",
                Amount = a.Quotation != null ? $"${a.Quotation!.TotalPrice:N2}" : "N/A",
                Requester = (a.RFQ != null && a.RFQ.CreatedBy != null) ? a.RFQ!.CreatedBy!.Name : "System Agent"
            })
            .ToListAsync();

        // 8. Recent Activities list
        var recentActivities = await _context.ActivityLogs
            .Include(act => act.User)
            .OrderByDescending(act => act.CreatedAt)
            .Take(4)
            .ToListAsync();

        var dashboardActivities = recentActivities.Select(act =>
        {
            var type = "info";
            var actionLower = act.Action.ToLower();
            if (actionLower.Contains("reject") || actionLower.Contains("fail") || actionLower.Contains("cancel") || actionLower.Contains("danger"))
            {
                type = "danger";
            }
            else if (actionLower.Contains("pending") || actionLower.Contains("warning") || actionLower.Contains("review"))
            {
                type = "warning";
            }
            else if (actionLower.Contains("approve") || actionLower.Contains("success") || act.EntityType == "INVOICE")
            {
                type = "success";
            }

            return new DashboardActivityDto
            {
                Id = act.Id,
                Action = act.Action,
                Timestamp = act.CreatedAt,
                Type = type,
                User = act.User != null ? act.User.Name : "System Agent"
            };
        }).ToList();

        // 9. Report Service outputs
        var trend = (await _reportService.GetMonthlyTrendAsync(null, null)).ToList();
        var vendorsPerformance = (await _reportService.GetVendorPerformanceAsync(null, null)).ToList();

        return new DashboardPayloadDto
        {
            DashboardSummary = new DashboardSummaryDto
            {
                ActiveRfqs = activeRfqsCount,
                PendingApprovals = pendingApprovalsCount,
                MonthlySpend = monthlySpend,
                OverdueInvoices = overdueInvoicesCount,
                RecentPurchaseOrders = recentPOs
            },
            SpendingTrend = trend,
            VendorPerformance = vendorsPerformance,
            RecentRfqs = dashboardRfqs,
            PendingApprovals = pendingApprovalsList,
            Activities = dashboardActivities
        };
    }
}
