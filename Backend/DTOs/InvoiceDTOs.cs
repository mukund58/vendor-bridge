using System;
using System.Collections.Generic;

namespace Backend.DTOs;

public class CreateInvoiceDto
{
    public int PurchaseOrderId { get; set; }
    public int? purchase_order_id { get; set; }

    public int GetPurchaseOrderId() => purchase_order_id ?? PurchaseOrderId;
}

public class InvoiceDto
{
    public int Id { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;
    public string invoice_number => InvoiceNumber;

    public int PurchaseOrderId { get; set; }
    public int purchase_order_id => PurchaseOrderId;

    public int VendorId { get; set; }
    public int vendor_id => VendorId;

    public string VendorName { get; set; } = string.Empty;
    public string vendor_name => VendorName;

    public decimal Subtotal { get; set; } // System.Text.Json translates this to "subtotal"

    public decimal TaxAmount { get; set; }
    public decimal tax_amount => TaxAmount;

    public decimal TotalAmount { get; set; }
    public decimal total_amount => TotalAmount;

    public string Status { get; set; } = "UNPAID"; // System.Text.Json translates this to "status"

    public DateTime CreatedAt { get; set; }
    public DateTime created_at => CreatedAt;

    public List<InvoiceItemDto> Items { get; set; } = new();
}

public class InvoiceItemDto
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public int invoice_id => InvoiceId;
    public string ItemName { get; set; } = string.Empty;
    public string item_name => ItemName;
    public double Quantity { get; set; } // System.Text.Json translates this to "quantity"
    public decimal UnitPrice { get; set; }
    public decimal unit_price => UnitPrice;
    public decimal TotalPrice { get; set; }
    public decimal total_price => TotalPrice;
}
