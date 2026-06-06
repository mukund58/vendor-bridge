using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        // 1. Seed Users
        if (!db.Users.Any())
        {
            var users = new List<User>
            {
                new()
                {
                    FirstName = "Admin",
                    LastName = "Executive",
                    Email = "adminlogs@test.com",
                    Phone = "0987654321",
                    Country = "USA",
                    Role = "ADMIN",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123")
                },
                new()
                {
                    FirstName = "Jane",
                    LastName = "Manager",
                    Email = "manager@test.com",
                    Phone = "1234567890",
                    Country = "USA",
                    Role = "MANAGER",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123")
                },
                new()
                {
                    FirstName = "Integ",
                    LastName = "Tester",
                    Email = "tester@integlog.com",
                    Phone = "9876543210",
                    Country = "India",
                    Role = "VENDOR",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123")
                }
            };
            db.Users.AddRange(users);
            db.SaveChanges();
        }

        var adminUser = db.Users.FirstOrDefault(u => u.Role == "ADMIN");
        var vendorUser = db.Users.FirstOrDefault(u => u.Role == "VENDOR");

        // 2. Seed Vendors
        if (!db.Vendors.Any())
        {
            var vendors = new List<Vendor>
            {
                new() { CompanyName = "Apex Metals Ltd", GstNumber = "27AAACA1111A1Z1", Category = "Raw Materials", Status = VendorStatus.ACTIVE, Email = "apex@metals.com", Phone = "9876543211", ContactPerson = "Apex Rep", Rating = 4.8 },
                new() { CompanyName = "NetScale Solutions", GstNumber = "27AAACA1112A1Z1", Category = "IT Solutions", Status = VendorStatus.ACTIVE, Email = "netscale@solutions.com", Phone = "9876543212", ContactPerson = "Netscale Rep", Rating = 4.5 },
                new() { CompanyName = "Titan Heavy Industries", GstNumber = "27AAACA1113A1Z1", Category = "Raw Materials", Status = VendorStatus.ACTIVE, Email = "titan@heavy.com", Phone = "9876543213", ContactPerson = "Titan Rep", Rating = 4.6 },
                new() { CompanyName = "Habitat Crafts", GstNumber = "27AAACA1114A1Z1", Category = "Supplies", Status = VendorStatus.ACTIVE, Email = "habitat@crafts.com", Phone = "9876543214", ContactPerson = "Habitat Rep", Rating = 4.0 },
                new() { CompanyName = "Global Logistics", GstNumber = "27AAACA1115A1Z1", Category = "Logistics", Status = VendorStatus.ACTIVE, Email = "global@logistics.com", Phone = "9876543215", ContactPerson = "Global Rep", Rating = 4.3 }
            };
            db.Vendors.AddRange(vendors);
            db.SaveChanges();
        }

        var selectedVendor = db.Vendors.FirstOrDefault();

        // 3. Seed RFQs, Quotations, POs, Invoices for Monthly Trend
        if (!db.Invoices.Any() && selectedVendor != null && adminUser != null)
        {
            var baseDate = DateTime.UtcNow;

            for (int i = 5; i >= 0; i--)
            {
                var targetMonthDate = baseDate.AddMonths(-i);
                decimal monthSpendAmount = i switch
                {
                    5 => 84000m,
                    4 => 96000m,
                    3 => 145000m,
                    2 => 112000m,
                    1 => 198000m,
                    0 => 230000m,
                    _ => 100000m
                };

                // RFQ
                var rfq = new RFQ
                {
                    Title = $"Seeded Materials {targetMonthDate:MMM yyyy}",
                    Description = "Seeded description for analytics history",
                    Deadline = targetMonthDate.AddDays(7),
                    CreatedById = adminUser.Id,
                    Status = RFQStatus.Completed,
                    CreatedAt = targetMonthDate
                };
                db.RFQs.Add(rfq);
                db.SaveChanges();

                // RFQ Item
                var rfqItem = new RFQItem
                {
                    RFQId = rfq.Id,
                    ItemName = "Coils",
                    Quantity = 10,
                    Unit = "NOS"
                };
                db.RFQItems.Add(rfqItem);
                db.SaveChanges();

                // Quotation
                var quotation = new Quotation
                {
                    RFQId = rfq.Id,
                    VendorId = selectedVendor.Id,
                    GstPercentage = 18m,
                    TotalPrice = monthSpendAmount,
                    DeliveryDays = 5,
                    Status = QuotationStatus.Selected,
                    SubmittedAt = targetMonthDate
                };
                db.Quotations.Add(quotation);
                db.SaveChanges();

                // PO
                var po = new PurchaseOrder
                {
                    PONumber = $"PO-2026-000{6-i}",
                    RFQId = rfq.Id,
                    QuotationId = quotation.Id,
                    VendorId = selectedVendor.Id,
                    TotalPrice = monthSpendAmount,
                    DeliveryDays = 5,
                    Status = "DELIVERED",
                    CreatedAt = targetMonthDate
                };
                db.PurchaseOrders.Add(po);
                db.SaveChanges();

                // Invoice
                var subtotal = Math.Round(monthSpendAmount / 1.18m, 2);
                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-2026-000{6-i}",
                    PurchaseOrderId = po.Id,
                    VendorId = selectedVendor.Id,
                    Subtotal = subtotal,
                    TaxAmount = monthSpendAmount - subtotal,
                    TotalAmount = monthSpendAmount,
                    Status = InvoiceStatus.PAID,
                    CreatedAt = targetMonthDate
                };
                db.Invoices.Add(invoice);
                db.SaveChanges();
            }

            // Overdue Invoices
            for (int k = 1; k <= 3; k++)
            {
                var targetDate = baseDate.AddDays(-15 - k);
                var rfq = new RFQ
                {
                    Title = $"Overdue Materials Audit {k}",
                    Description = "Overdue invoice audit RFQ",
                    Deadline = targetDate.AddDays(5),
                    CreatedById = adminUser.Id,
                    Status = RFQStatus.Completed,
                    CreatedAt = targetDate
                };
                db.RFQs.Add(rfq);
                db.SaveChanges();

                var quotation = new Quotation
                {
                    RFQId = rfq.Id,
                    VendorId = selectedVendor.Id,
                    GstPercentage = 18m,
                    TotalPrice = 5000m,
                    DeliveryDays = 5,
                    Status = QuotationStatus.Selected,
                    SubmittedAt = targetDate
                };
                db.Quotations.Add(quotation);
                db.SaveChanges();

                var po = new PurchaseOrder
                {
                    PONumber = $"PO-2026-900{k}",
                    RFQId = rfq.Id,
                    QuotationId = quotation.Id,
                    VendorId = selectedVendor.Id,
                    TotalPrice = 5000m,
                    DeliveryDays = 5,
                    Status = "DELIVERED",
                    CreatedAt = targetDate
                };
                db.PurchaseOrders.Add(po);
                db.SaveChanges();

                var subtotal = Math.Round(5000m / 1.18m, 2);
                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-2026-900{k}",
                    PurchaseOrderId = po.Id,
                    VendorId = selectedVendor.Id,
                    Subtotal = subtotal,
                    TaxAmount = 5000m - subtotal,
                    TotalAmount = 5000m,
                    Status = InvoiceStatus.OVERDUE,
                    CreatedAt = targetDate
                };
                db.Invoices.Add(invoice);
                db.SaveChanges();
            }
        }
    }
}
