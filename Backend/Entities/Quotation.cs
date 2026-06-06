namespace Backend.Entities;

public enum QuotationStatus
{
    Submitted,
    UnderReview,
    Selected,
    Rejected
}

public class Quotation
{
    public int Id { get; set; }
    public int RFQId { get; set; }
    public RFQ? RFQ { get; set; }
    public int VendorId { get; set; }
    public Vendor? Vendor { get; set; }
    public decimal GstPercentage { get; set; }
    public decimal TotalPrice { get; set; }
    public int DeliveryDays { get; set; }
    public string Notes { get; set; } = string.Empty;
    public QuotationStatus Status { get; set; } = QuotationStatus.Submitted;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public ICollection<QuotationItem> Items { get; set; } = new List<QuotationItem>();
}

public class QuotationItem
{
    public int Id { get; set; }
    public int QuotationId { get; set; }
    public int RFQItemId { get; set; }
    public RFQItem? RFQItem { get; set; }
    public decimal UnitPrice { get; set; }
    public int DeliveryDays { get; set; }
}