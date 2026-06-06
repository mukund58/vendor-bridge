using Backend.Entities;

namespace Backend.DTOs;

public class VendorDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double Rating { get; set; }
}

public class CreateVendorDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public double Rating { get; set; } = 4.0;
}

public class UpdateVendorStatusDto
{
    public string Status { get; set; } = string.Empty;
}