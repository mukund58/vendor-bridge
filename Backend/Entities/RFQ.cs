namespace Backend.Entities;

public enum RFQStatus
{
    Draft,
    Published,
    QuotationReceived,
    UnderReview,
    Completed
}

public class RFQ
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public RFQStatus Status { get; set; } = RFQStatus.Draft;
    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RFQItem> Items { get; set; } = new List<RFQItem>();
    public ICollection<RFQVendor> RFQVendors { get; set; } = new List<RFQVendor>();
}

public class RFQItem
{
    public int Id { get; set; }
    public int RFQId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = "NOS";
}

public class RFQVendor
{
    public int Id { get; set; }
    public int RFQId { get; set; }
    public int VendorId { get; set; }
    public Vendor? Vendor { get; set; }
}