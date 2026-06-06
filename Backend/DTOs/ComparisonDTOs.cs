using Backend.DTOs;

namespace Backend.DTOs;

public class RFQComparisonDto
{
    public int RfqId { get; set; }
    public string WinnerSuggestion { get; set; } = string.Empty;
    public bool LowestPrice { get; set; }
    public List<QuotationComparisonDto> Quotations { get; set; } = new();
}

public class QuotationComparisonDto
{
    public int QuotationId { get; set; }
    public string Vendor { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int DeliveryDays { get; set; }
    public double Rating { get; set; }
    public bool IsLowestPrice { get; set; }
    public bool IsFastestDelivery { get; set; }
}

public class SelectWinningQuotationDto
{
    public int QuotationId { get; set; }
}
