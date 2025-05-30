namespace DigitalHSE.Domain.Common;

public abstract class Entity
{
    public int Id { get; set; }
}

public abstract class TrackableEntity : Entity
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
}