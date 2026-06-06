using System;
using System.Collections.Generic;

namespace Backend.DTOs;

public class DashboardSummaryDto
{
    public int ActiveRfqs { get; set; }
    public int PendingApprovals { get; set; }
    public decimal MonthlySpend { get; set; }
    public int OverdueInvoices { get; set; }
    public List<DashboardPoDto> RecentPurchaseOrders { get; set; } = new();
}

public class DashboardPoDto
{
    public int Id { get; set; }
    public string Po_number { get; set; } = string.Empty;
    public string Vendor_name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Created_at { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class DashboardRfqDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int Submissions { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class DashboardApprovalDto
{
    public int Id { get; set; }
    public string Type { get; set; } = "Purchase Order";
    public string Subject { get; set; } = string.Empty;
    public string Amount { get; set; } = string.Empty;
    public string Requester { get; set; } = string.Empty;
}

public class DashboardActivityDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Type { get; set; } = "info"; // success, warning, danger, info
    public string User { get; set; } = "System Agent";
}

public class DashboardPayloadDto
{
    public DashboardSummaryDto DashboardSummary { get; set; } = new();
    public List<MonthlyTrendDto> SpendingTrend { get; set; } = new();
    public List<VendorPerformanceDto> VendorPerformance { get; set; } = new();
    public List<DashboardRfqDto> RecentRfqs { get; set; } = new();
    public List<DashboardApprovalDto> PendingApprovals { get; set; } = new();
    public List<DashboardActivityDto> Activities { get; set; } = new();
}
