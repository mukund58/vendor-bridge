using System;

namespace Backend.DTOs;

public class ReportSummaryDto
{
    public decimal TotalSpend { get; set; }
    public decimal total_spend => TotalSpend;

    public int ActiveVendors { get; set; }
    public int active_vendors => ActiveVendors;

    public double PoFulfillment { get; set; }
    public double po_fulfillment => PoFulfillment;

    public int OverdueInvoices { get; set; }
    public int overdue_invoices => OverdueInvoices;
}

public class VendorPerformanceDto
{
    public string Name { get; set; } = string.Empty;
    public double Compliance { get; set; }
    public double Delivery { get; set; }
    public double Quality { get; set; }
}

public class MonthlyTrendDto
{
    public string Month { get; set; } = string.Empty; // e.g., "Jan", "Feb"
    public decimal Amount { get; set; }
}
