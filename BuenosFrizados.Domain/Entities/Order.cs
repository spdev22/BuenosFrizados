namespace BuenosFrizados.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string ClientPhoneNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal Total => Items.Sum(i => i.Quantity * i.UnitPrice);
    // navigation properties
    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }

    // navigation properties
    public Order Order { get; set; }
    public Product Product { get; set; }
}
