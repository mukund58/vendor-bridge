using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.Services;

public interface IPdfService
{
    Task<byte[]> GenerateInvoicePdfAsync(Invoice invoice);
}

public class PdfService : IPdfService
{
    public Task<byte[]> GenerateInvoicePdfAsync(Invoice invoice)
    {
        using var ms = new MemoryStream();
        using var writer = new StreamWriter(ms, Encoding.ASCII);
        
        var offsets = new List<long>();
        
        // Write PDF header
        writer.Write("%PDF-1.4\n");
        writer.Write("%\xE2\xE3\xCF\xD3\n");
        writer.Flush();
        
        // Helper to start an object and track its offset
        void StartObject(int id)
        {
            writer.Flush();
            offsets.Add(ms.Position);
            writer.Write($"{id} 0 obj\n");
        }
        
        // Helper to end an object
        void EndObject()
        {
            writer.Write("endobj\n");
            writer.Flush();
        }

        // 1. Catalog
        StartObject(1);
        writer.Write("<< /Type /Catalog /Pages 2 0 R >>\n");
        EndObject();

        // 2. Pages
        StartObject(2);
        writer.Write("<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>\n");
        EndObject();

        // 3. Page
        StartObject(3);
        writer.Write("<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.27 841.89] /Contents 6 0 R >>\n");
        EndObject();

        // 4. Regular Font
        StartObject(4);
        writer.Write("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n");
        EndObject();

        // 5. Bold Font
        StartObject(5);
        writer.Write("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\n");
        EndObject();

        // 6. Content Stream
        var content = new StringBuilder();
        
        // Helper to escape text in PDF string
        string EscapePdfText(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;
            return text.Replace("\\", "\\\\").Replace("(", "\\(").Replace(")", "\\)");
        }

        // Draw header text
        content.AppendLine("BT");
        content.AppendLine("/F2 20 Tf"); // Helvetica-Bold size 20
        content.AppendLine("50 780 Td");
        content.AppendLine("(TAX INVOICE) Tj");
        content.AppendLine("ET");

        // Draw separator line
        content.AppendLine("1 w"); // Line width 1
        content.AppendLine("50 765 m 545 765 l S");

        // Draw Invoice Details
        content.AppendLine("BT");
        content.AppendLine("/F1 10 Tf"); // Helvetica size 10
        content.AppendLine("14 TL"); // Set leading to 14 points
        content.AppendLine("50 740 Td");
        content.AppendLine($"(Invoice Number: {EscapePdfText(invoice.InvoiceNumber)}) Tj T*");
        content.AppendLine($"(Invoice Date: {EscapePdfText(invoice.CreatedAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm"))}) Tj T*");
        content.AppendLine($"(Associated PO Number: {EscapePdfText(invoice.PurchaseOrder?.PONumber ?? "N/A")}) Tj");
        content.AppendLine("ET");

        // Draw Vendor Details
        content.AppendLine("BT");
        content.AppendLine("/F2 11 Tf"); // Helvetica-Bold size 11
        content.AppendLine("14 TL");
        content.AppendLine("50 670 Td");
        content.AppendLine("(VENDOR PARTNER INFORMATION) Tj T*");
        content.AppendLine("/F1 10 Tf");
        content.AppendLine($"(Company Name: {EscapePdfText(invoice.Vendor?.CompanyName ?? "Unknown Vendor")}) Tj T*");
        content.AppendLine($"(GST Number: {EscapePdfText(invoice.Vendor?.GstNumber ?? "N/A")}) Tj T*");
        content.AppendLine($"(Contact Person: {EscapePdfText(invoice.Vendor?.ContactPerson ?? "N/A")}) Tj T*");
        content.AppendLine($"(Email: {EscapePdfText(invoice.Vendor?.Email ?? "N/A")}) Tj T*");
        content.AppendLine($"(Phone: {EscapePdfText(invoice.Vendor?.Phone ?? "N/A")}) Tj");
        content.AppendLine("ET");

        // Draw items table header
        content.AppendLine("50 560 m 545 560 l S"); // horizontal line above table
        
        content.AppendLine("BT");
        content.AppendLine("/F2 10 Tf");
        content.AppendLine("50 545 Td");
        content.AppendLine("(Item Description) Tj");
        content.AppendLine("ET");

        content.AppendLine("BT");
        content.AppendLine("/F2 10 Tf");
        content.AppendLine("280 545 Td");
        content.AppendLine("(Quantity) Tj");
        content.AppendLine("ET");

        content.AppendLine("BT");
        content.AppendLine("/F2 10 Tf");
        content.AppendLine("370 545 Td");
        content.AppendLine("(Unit Price) Tj");
        content.AppendLine("ET");

        content.AppendLine("BT");
        content.AppendLine("/F2 10 Tf");
        content.AppendLine("460 545 Td");
        content.AppendLine("(Total Price) Tj");
        content.AppendLine("ET");
        
        content.AppendLine("50 535 m 545 535 l S"); // horizontal line below header

        // Draw item rows
        int yOffset = 515;
        if (invoice.Items != null)
        {
            foreach (var item in invoice.Items)
            {
                content.AppendLine("BT");
                content.AppendLine("/F1 10 Tf");
                content.AppendLine($"50 {yOffset} Td");
                content.AppendLine($"({EscapePdfText(item.ItemName)}) Tj");
                content.AppendLine("ET");

                content.AppendLine("BT");
                content.AppendLine("/F1 10 Tf");
                content.AppendLine($"280 {yOffset} Td");
                content.AppendLine($"({item.Quantity}) Tj");
                content.AppendLine("ET");

                content.AppendLine("BT");
                content.AppendLine("/F1 10 Tf");
                content.AppendLine($"370 {yOffset} Td");
                content.AppendLine($"($ {item.UnitPrice:F2}) Tj");
                content.AppendLine("ET");

                content.AppendLine("BT");
                content.AppendLine("/F1 10 Tf");
                content.AppendLine($"460 {yOffset} Td");
                content.AppendLine($"($ {item.TotalPrice:F2}) Tj");
                content.AppendLine("ET");

                yOffset -= 20;
            }
        }

        // Draw horizontal line below items
        content.AppendLine($"50 {yOffset + 5} m 545 {yOffset + 5} l S");

        // Draw summary totals
        yOffset -= 15;
        content.AppendLine("BT");
        content.AppendLine("/F1 10 Tf");
        content.AppendLine("14 TL");
        content.AppendLine($"350 {yOffset} Td");
        content.AppendLine($"(Subtotal: $ {invoice.Subtotal:F2}) Tj T*");
        content.AppendLine($"(GST Tax \\(18%\\): $ {invoice.TaxAmount:F2}) Tj T*");
        content.AppendLine("/F2 11 Tf");
        content.AppendLine($"(Grand Total: $ {invoice.TotalAmount:F2}) Tj");
        content.AppendLine("ET");

        // Convert content string to byte array
        var streamBytes = Encoding.UTF8.GetBytes(content.ToString());
        
        StartObject(6);
        writer.Write($"<< /Length {streamBytes.Length} >>\n");
        writer.Write("stream\n");
        writer.Flush();
        ms.Write(streamBytes, 0, streamBytes.Length);
        writer.Write("\nendstream\n");
        EndObject();

        // Write cross-reference table (xref)
        writer.Flush();
        long xrefOffset = ms.Position;
        writer.Write("xref\n");
        writer.Write("0 7\n");
        // Object 0
        writer.Write("0000000000 65535 f \n");
        // Objects 1 to 6
        for (int i = 0; i < 6; i++)
        {
            writer.Write($"{offsets[i]:D10} 00000 n \n");
        }
        
        // Write trailer
        writer.Write("trailer\n");
        writer.Write("<< /Size 7 /Root 1 0 R >>\n");
        writer.Write("startxref\n");
        writer.Write($"{xrefOffset}\n");
        writer.Write("%%EOF\n");
        writer.Flush();

        return Task.FromResult(ms.ToArray());
    }
}
