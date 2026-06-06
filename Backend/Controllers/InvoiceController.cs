using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/invoices")]
[Authorize]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly IPdfService _pdfService;
    private readonly IEmailService _emailService;
    private readonly AppDbContext _context;

    public InvoiceController(
        IInvoiceService invoiceService,
        IPdfService pdfService,
        IEmailService emailService,
        AppDbContext context)
    {
        _invoiceService = invoiceService;
        _pdfService = pdfService;
        _emailService = emailService;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceDto dto)
    {
        var purchaseOrderId = dto.GetPurchaseOrderId();
        if (purchaseOrderId <= 0)
        {
            return BadRequest(new { message = "Invalid purchase order ID." });
        }

        var invoice = await _invoiceService.CreateInvoiceFromPOAsync(purchaseOrderId);
        if (invoice == null)
        {
            return NotFound(new { message = "Purchase order not found." });
        }

        return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _invoiceService.GetInvoicesAsync();
        return Ok(invoices);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
        if (invoice == null)
        {
            return NotFound(new { message = "Invoice not found." });
        }

        return Ok(invoice);
    }

    [Route("{id}/mark-paid")]
    [HttpPatch]
    public async Task<IActionResult> MarkPaid(int id)
    {
        var result = await _invoiceService.MarkAsPaidAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Invoice not found." });
        }

        return Ok(new { success = true });
    }

    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetInvoicePdf(int id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Items)
            .Include(i => i.Vendor)
            .Include(i => i.PurchaseOrder)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return NotFound(new { message = "Invoice not found." });
        }

        var pdfBytes = await _pdfService.GenerateInvoicePdfAsync(invoice);
        return File(pdfBytes, "application/pdf", $"{invoice.InvoiceNumber}.pdf");
    }

    [HttpPost("{id}/email")]
    public async Task<IActionResult> SendInvoiceEmail(int id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Items)
            .Include(i => i.Vendor)
            .Include(i => i.PurchaseOrder)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return NotFound(new { message = "Invoice not found." });
        }

        var pdfBytes = await _pdfService.GenerateInvoicePdfAsync(invoice);
        var success = await _emailService.SendInvoiceEmailAsync(invoice, pdfBytes);

        if (!success)
        {
            return StatusCode(500, new { message = "Failed to dispatch email." });
        }

        return Ok(new { success = true, message = "Email dispatched successfully with invoice PDF attached." });
    }
}
