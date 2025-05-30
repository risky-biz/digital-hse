namespace DigitalHSE.Domain.HSE.ValueObjects;

public class ContactInfo : IEquatable<ContactInfo>
{
    public string Name { get; }
    public string Email { get; }
    public string Phone { get; }
    public string Department { get; }
    public string Position { get; }
    
    public ContactInfo(string name, string email, string phone = "", string department = "", string position = "")
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));
            
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));
            
        if (!IsValidEmail(email))
            throw new ArgumentException("Invalid email format", nameof(email));
            
        Name = name;
        Email = email.ToLowerInvariant();
        Phone = phone ?? string.Empty;
        Department = department ?? string.Empty;
        Position = position ?? string.Empty;
    }
    
    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
    
    public bool Equals(ContactInfo? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        
        return Name == other.Name &&
               Email == other.Email &&
               Phone == other.Phone &&
               Department == other.Department &&
               Position == other.Position;
    }
    
    public override bool Equals(object? obj) => Equals(obj as ContactInfo);
    
    public override int GetHashCode() => HashCode.Combine(Name, Email, Phone, Department, Position);
    
    public override string ToString() => $"{Name} ({Email})";
}