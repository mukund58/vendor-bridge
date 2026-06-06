using System;

namespace Backend.DTOs;

public class ApprovalDto
{
    public int Id { get; set; }
    public int RFQId { get; set; }
    public string RfqTitle { get; set; } = string.Empty;
    public string Rfq_title => RfqTitle; // snake_case compatibility
    public string VendorName { get; set; } = string.Empty;
    public string Vendor_name => VendorName; // snake_case compatibility
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime Created_at => CreatedAt; // snake_case compatibility
    public string Requester { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
}

public class ApproveRejectDto
{
    public string Remarks { get; set; } = string.Empty;
}
