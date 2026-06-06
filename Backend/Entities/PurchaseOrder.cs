using System;
using System.Collections.Generic;

namespace Backend.Entities;

public class PurchaseOrder
{
    public int Id { get; set; }
    public string PONumber { get; set; } = string.Empty;
    public int? RFQId { get; set; }
    public RFQ? RFQ { get; set; }
    public int QuotationId { get; set; }
    public Quotation? Quotation { get; set; }
    public int VendorId { get; set; }
    public Vendor? Vendor { get; set; }
    public decimal TotalPrice { get; set; }
    public int DeliveryDays { get; set; }
    public string Status { get; set; } = "ACKNOWLEDGED"; // e.g., ACKNOWLEDGED, IN_TRANSIT, DELIVERED
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
}

public class PurchaseOrderItem
{
    public int Id { get; set; }
    public int PurchaseOrderId { get; set; }
    public PurchaseOrder? PurchaseOrder { get; set; }
    public int RFQItemId { get; set; }
    public RFQItem? RFQItem { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}
