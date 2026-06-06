using System;
using System.Threading.Tasks;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/reports")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var summary = await _reportService.GetReportsSummaryAsync(startDate, endDate);
        return Ok(summary);
    }

    [HttpGet("vendors")]
    public async Task<IActionResult> GetVendors([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var vendors = await _reportService.GetVendorPerformanceAsync(startDate, endDate);
        return Ok(vendors);
    }

    [HttpGet("monthly-trend")]
    public async Task<IActionResult> GetMonthlyTrend([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var trend = await _reportService.GetMonthlyTrendAsync(startDate, endDate);
        return Ok(trend);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportReport([FromQuery] string format, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        if (string.IsNullOrEmpty(format))
        {
            return BadRequest(new { message = "Format query parameter is required." });
        }

        var data = await _reportService.ExportReportAsync(format, startDate, endDate);
        
        string contentType;
        string fileDownloadName;

        if (format.ToLower().Contains("excel") || format.ToLower().Contains("csv"))
        {
            contentType = "text/csv";
            fileDownloadName = $"procurement_report_{DateTime.UtcNow:yyyyMMdd}.csv";
        }
        else
        {
            contentType = "application/pdf";
            fileDownloadName = $"procurement_report_{DateTime.UtcNow:yyyyMMdd}.pdf";
        }

        return File(data, contentType, fileDownloadName);
    }
}
