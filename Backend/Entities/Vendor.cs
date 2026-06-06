namespace Backend.Entities;

public enum VendorStatus
{
    ACTIVE,
    BLOCKED,
    PENDING
}

public class Vendor
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public VendorStatus Status { get; set; } = VendorStatus.ACTIVE;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}