namespace DigitalHSE.Domain.HSE.Enums;

public enum IncidentSeverity
{
    // 5-level classification as per BSJ requirements
    Minor = 1,          // No injury, minimal impact
    Low = 2,            // First aid only, minor property damage
    Moderate = 3,       // Medical treatment required, moderate impact
    Major = 4,          // Serious injury, hospitalization required, significant impact
    Critical = 5        // Life-threatening, permanent disability, major impact
}