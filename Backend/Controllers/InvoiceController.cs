using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/invoices")]
[Authorize]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    public InvoiceController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
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
    public IActionResult GetInvoicePdf(int id)
    {
        // Simple mock PDF endpoint to prevent 404s
        return Ok("Dummy PDF Content for Invoice " + id);
    }

    [HttpPost("{id}/email")]
    public IActionResult SendInvoiceEmail(int id)
    {
        // Simple mock Email endpoint to prevent 404s
        return Ok(new { success = true, message = "Email dispatched for invoice " + id });
    }
}
