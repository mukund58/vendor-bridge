namespace Backend.DTOs;

public class SubmitQuotationDto
{
    public int RFQId { get; set; }
    public List<SubmitQuotationItemDto> Items { get; set; } = new();
    public decimal GstPercentage { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class SubmitQuotationItemDto
{
    public int ItemId { get; set; } // This is RFQItemId
    public decimal UnitPrice { get; set; }
    public int DeliveryDays { get; set; }
}

public class QuotationDto
{
    public int Id { get; set; }
    public int RFQId { get; set; }
    public int VendorId { get; set; }
    public string VendorName { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public int DeliveryDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public List<QuotationItemDto> Items { get; set; } = new();
}

public class QuotationItemDto
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int DeliveryDays { get; set; }
}