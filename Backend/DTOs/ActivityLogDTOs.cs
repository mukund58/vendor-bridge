using System;

namespace Backend.DTOs;

public class ActivityLogDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public DateTime created_at => Timestamp; // snake_case compatibility
    public string Type { get; set; } = string.Empty; // RFQ, APPROVAL, INVOICE, PURCHASE ORDER
    public string Status { get; set; } = "SUCCESS"; // SUCCESS, WARNING, DANGER
    public string User { get; set; } = "System Agent";
}
