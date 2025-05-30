namespace DigitalHSE.Domain.HSE.ValueObjects;

public class Location : IEquatable<Location>
{
    public string Building { get; }
    public string Floor { get; }
    public string Room { get; }
    public string Area { get; }
    public string GPSCoordinates { get; }
    
    public Location(string building, string floor = "", string room = "", string area = "", string gpsCoordinates = "")
    {
        if (string.IsNullOrWhiteSpace(building))
            throw new ArgumentException("Building cannot be empty", nameof(building));
            
        Building = building;
        Floor = floor ?? string.Empty;
        Room = room ?? string.Empty;
        Area = area ?? string.Empty;
        GPSCoordinates = gpsCoordinates ?? string.Empty;
    }
    
    public string FullLocation => string.Join(" - ", 
        new[] { Building, Floor, Room, Area }
        .Where(s => !string.IsNullOrWhiteSpace(s)));
    
    public bool Equals(Location? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        
        return Building == other.Building &&
               Floor == other.Floor &&
               Room == other.Room &&
               Area == other.Area &&
               GPSCoordinates == other.GPSCoordinates;
    }
    
    public override bool Equals(object? obj) => Equals(obj as Location);
    
    public override int GetHashCode() => HashCode.Combine(Building, Floor, Room, Area, GPSCoordinates);
    
    public override string ToString() => FullLocation;
}