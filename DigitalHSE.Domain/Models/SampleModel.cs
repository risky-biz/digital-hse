using BuildingBlocks.Domain.Models;
using DigitalHSE.Domain.Enums;

namespace DigitalHSE.Domain.Models;

public class SampleModel : TrackableEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
    public GenderEnum Gender { get; set; }
    public string Address { get; set; } = string.Empty;
}
