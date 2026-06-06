namespace Backend.DTOs;

public class CreateRFQDto
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public List<int> Vendors { get; set; } = new();
    public List<CreateRFQItemDto> Items { get; set; } = new();
}

public class CreateRFQItemDto
{
    public string ItemName { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = "NOS";
}

public class RFQDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<RFQItemDto> Items { get; set; } = new();
    public List<int> VendorIds { get; set; } = new();
}

public class RFQItemDto
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
}