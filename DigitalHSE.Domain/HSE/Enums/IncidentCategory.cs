namespace DigitalHSE.Domain.HSE.Enums;

public enum IncidentCategory
{
    // Student-related incidents
    StudentInjurySports = 1,
    StudentInjuryPlayground = 2,
    StudentInjuryClassroom = 3,
    StudentInjuryLaboratory = 4,
    StudentMedicalEmergency = 5,
    StudentBehavioralIncident = 6,
    
    // Staff/Teacher incidents
    StaffInjury = 10,
    TeacherInjury = 11,
    StaffMedicalEmergency = 12,
    
    // Visitor incidents
    VisitorInjury = 20,
    VisitorMedicalEmergency = 21,
    
    // Property and Infrastructure
    PropertyDamage = 30,
    EquipmentFailure = 31,
    InfrastructureDefect = 32,
    
    // Environmental incidents
    EnvironmentalIncident = 40,
    AirQualityIssue = 41,
    WaterContamination = 42,
    NoiseComplaint = 43,
    
    // Security incidents
    SecurityBreach = 50,
    Theft = 51,
    Vandalism = 52,
    UnauthorizedAccess = 53,
    BullyingHarassment = 54,
    Violence = 55,
    
    // Near-miss events
    NearMiss = 60,
    UnsafeCondition = 61,
    UnsafeBehavior = 62,
    
    // Laboratory and Chemical
    LaboratoryAccident = 70,
    ChemicalSpill = 71,
    ChemicalExposure = 72,
    
    // Transportation
    SchoolBusIncident = 80,
    FieldTripIncident = 81,
    ParkingAreaIncident = 82,
    
    // Food Safety
    FoodPoisoning = 90,
    FoodAllergy = 91,
    KitchenIncident = 92,
    
    // Contractor incidents
    ContractorInjury = 100,
    ContractorPropertyDamage = 101,
    
    // Cyber Safety
    CyberSafetyIncident = 110,
    DataBreach = 111,
    OnlineHarassment = 112,
    
    // Other
    Other = 999
}