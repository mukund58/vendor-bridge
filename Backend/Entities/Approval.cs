using System;

namespace Backend.Entities;

public enum ApprovalStatus
{
    PENDING,
    L1_APPROVED,
    L2_APPROVED,
    PO_GENERATED,
    REJECTED
}

public class Approval
{
    public int Id { get; set; }
    
    public int RFQId { get; set; }
    public RFQ? RFQ { get; set; }
    
    public int QuotationId { get; set; }
    public Quotation? Quotation { get; set; }
    
    public int? ApproverId { get; set; }
    public User? Approver { get; set; }
    
    public int Level { get; set; } = 1; // 1 or 2
    
    public ApprovalStatus Status { get; set; } = ApprovalStatus.PENDING;
    
    public string Remarks { get; set; } = string.Empty;
    
    public DateTime? ApprovedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
