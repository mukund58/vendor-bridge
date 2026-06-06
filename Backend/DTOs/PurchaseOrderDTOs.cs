using System;
using System.Collections.Generic;

namespace Backend.DTOs;

public class CreatePurchaseOrderDto
{
    public int QuotationId { get; set; }
    public int? quotation_id { get; set; }

    public int GetQuotationId() => quotation_id ?? QuotationId;
}

public class PurchaseOrderDto
{
    public int Id { get; set; }
    
    public string PONumber { get; set; } = string.Empty;
    public string po_number => PONumber;

    public int? RFQId { get; set; }
    public int? rfq_id => RFQId;

    public int QuotationId { get; set; }
    public int quotation_id => QuotationId;

    public int VendorId { get; set; }
    public int vendor_id => VendorId;

    public string VendorName { get; set; } = string.Empty;
    public string vendor_name => VendorName;

    public decimal TotalPrice { get; set; }
    public decimal total_price => TotalPrice;
    public decimal Amount => TotalPrice; // System.Text.Json translates this to "amount"

    public int DeliveryDays { get; set; }
    public int delivery_days => DeliveryDays;

    public string Status { get; set; } = string.Empty; // System.Text.Json translates this to "status"

    public DateTime CreatedAt { get; set; }
    public DateTime created_at => CreatedAt;

    public List<PurchaseOrderItemDto> Items { get; set; } = new();
}

public class PurchaseOrderItemDto
{
    public int Id { get; set; }
    public int PurchaseOrderId { get; set; }
    public int purchase_order_id => PurchaseOrderId;
    public int RFQItemId { get; set; }
    public int rfq_item_id => RFQItemId;
    public string ItemName { get; set; } = string.Empty;
    public string item_name => ItemName;
    public double Quantity { get; set; } // System.Text.Json translates this to "quantity"
    public decimal UnitPrice { get; set; }
    public decimal unit_price => UnitPrice;
    public decimal TotalPrice { get; set; }
    public decimal total_price => TotalPrice;
}
