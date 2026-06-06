using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IPONumberGenerator
{
    Task<string> GeneratePONumberAsync();
    Task<string> GenerateInvoiceNumberAsync();
}

public class PONumberGenerator : IPONumberGenerator
{
    private readonly AppDbContext _context;

    public PONumberGenerator(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GeneratePONumberAsync()
    {
        var year = DateTime.UtcNow.Year.ToString();
        var prefix = $"PO-{year}-";

        var lastPO = await _context.PurchaseOrders
            .Where(p => p.PONumber.StartsWith(prefix))
            .OrderByDescending(p => p.PONumber)
            .FirstOrDefaultAsync();

        int nextSequence = 1;
        if (lastPO != null)
        {
            var parts = lastPO.PONumber.Split('-');
            if (parts.Length == 3 && int.TryParse(parts[2], out var lastSeq))
            {
                nextSequence = lastSeq + 1;
            }
        }

        return $"{prefix}{nextSequence:D4}";
    }

    public async Task<string> GenerateInvoiceNumberAsync()
    {
        var year = DateTime.UtcNow.Year.ToString();
        var prefix = $"INV-{year}-";

        var lastInvoice = await _context.Invoices
            .Where(i => i.InvoiceNumber.StartsWith(prefix))
            .OrderByDescending(i => i.InvoiceNumber)
            .FirstOrDefaultAsync();

        int nextSequence = 1;
        if (lastInvoice != null)
        {
            var parts = lastInvoice.InvoiceNumber.Split('-');
            if (parts.Length == 3 && int.TryParse(parts[2], out var lastSeq))
            {
                nextSequence = lastSeq + 1;
            }
        }

        return $"{prefix}{nextSequence:D4}";
    }
}
