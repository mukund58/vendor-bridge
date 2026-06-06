using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Backend.Entities;
using Microsoft.Extensions.Configuration;

namespace Backend.Services;

public interface IEmailService
{
    Task<bool> SendInvoiceEmailAsync(Invoice invoice, byte[] pdfAttachment);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<bool> SendInvoiceEmailAsync(Invoice invoice, byte[] pdfAttachment)
    {
        try
        {
            // Load configuration settings with robust fallbacks matching Mailtrap
            var host = _config["SMTP_HOST"] ?? _config["Smtp:Host"] ?? "sandbox.smtp.mailtrap.io";
            var portString = _config["SMTP_PORT"] ?? _config["Smtp:Port"] ?? "2525";
            int port = int.TryParse(portString, out var p) ? p : 2525;
            
            var username = _config["SMTP_USERNAME"] ?? _config["Smtp:Username"] ?? string.Empty;
            var password = _config["SMTP_PASSWORD"] ?? _config["Smtp:Password"] ?? string.Empty;

            var apiKey = _config["SMTP_API_KEY"] ?? _config["Smtp:ApiKey"];
            if (!string.IsNullOrEmpty(apiKey))
            {
                if (string.IsNullOrEmpty(username)) username = "api";
                password = apiKey;
            }

            var fromEmail = _config["SMTP_FROM_ADDRESS"] ?? _config["Smtp:FromEmail"] ?? "no-reply@vendorbridge.com";
            var fromName = _config["SMTP_FROM_NAME"] ?? _config["Smtp:FromName"] ?? "VendorBridge ERP";

            var enableSslString = _config["SMTP_USE_SSL"] ?? _config["Smtp:EnableSsl"] ?? "true";
            bool enableSsl = bool.TryParse(enableSslString, out var ssl) ? ssl : true;

            // If the vendor has no email, use a fallback
            var toEmail = invoice.Vendor?.Email;
            if (string.IsNullOrEmpty(toEmail))
            {
                toEmail = "vendor-recipient@test.com";
            }

            using var client = new SmtpClient(host, port);
            
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                client.Credentials = new NetworkCredential(username, password);
            }
            
            client.EnableSsl = enableSsl;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = $"Purchase Tax Invoice: {invoice.InvoiceNumber}",
                Body = $"Dear {invoice.Vendor?.CompanyName ?? "Vendor Partner"},\n\n" +
                       $"Please find attached the tax invoice {invoice.InvoiceNumber} generated for Purchase Order {invoice.PurchaseOrder?.PONumber ?? "N/A"}.\n\n" +
                       $"Invoice Summary:\n" +
                       $"- Subtotal: $ {invoice.Subtotal:F2}\n" +
                       $"- GST Tax (18%): $ {invoice.TaxAmount:F2}\n" +
                       $"- Grand Total: $ {invoice.TotalAmount:F2}\n\n" +
                       $"Thank you for your partnership.\n\n" +
                       $"Best regards,\n" +
                       $"VendorBridge Procurement Team",
                IsBodyHtml = false
            };

            mailMessage.To.Add(new MailAddress(toEmail));

            // Attach PDF
            using var pdfStream = new MemoryStream(pdfAttachment);
            var attachment = new Attachment(pdfStream, $"{invoice.InvoiceNumber}.pdf", "application/pdf");
            mailMessage.Attachments.Add(attachment);

            await client.SendMailAsync(mailMessage);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SMTP sending failed: {ex.Message}");
            return false;
        }
    }
}
