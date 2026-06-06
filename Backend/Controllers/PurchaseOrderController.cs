using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/purchase-orders")]
[Authorize]
public class PurchaseOrderController : ControllerBase
{
    private readonly IPurchaseOrderService _purchaseOrderService;

    public PurchaseOrderController(IPurchaseOrderService purchaseOrderService)
    {
        _purchaseOrderService = purchaseOrderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderDto dto)
    {
        var quotationId = dto.GetQuotationId();
        if (quotationId <= 0)
        {
            return BadRequest(new { message = "Invalid quotation ID." });
        }

        var po = await _purchaseOrderService.CreatePOFromQuotationAsync(quotationId);
        if (po == null)
        {
            return NotFound(new { message = "Quotation not found." });
        }

        return CreatedAtAction(nameof(GetPurchaseOrder), new { id = po.Id }, po);
    }

    [HttpGet]
    public async Task<IActionResult> GetPurchaseOrders()
    {
        var pos = await _purchaseOrderService.GetPurchaseOrdersAsync();
        return Ok(pos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPurchaseOrder(int id)
    {
        var po = await _purchaseOrderService.GetPurchaseOrderByIdAsync(id);
        if (po == null)
        {
            return NotFound(new { message = "Purchase order not found." });
        }

        return Ok(po);
    }
}
