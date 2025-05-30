namespace DigitalHSE.Domain.HSE.Enums;

public enum IncidentType
{
    // General HSE Types
    Injury = 1,
    NearMiss = 2,
    PropertyDamage = 3,
    Environmental = 4,
    Fire = 5,
    ChemicalSpill = 6,
    
    // Educational Institution Specific Types (BSJ Requirements)
    StudentInjury = 10,
    StaffInjury = 11,
    TeacherInjury = 12,
    PlaygroundAccident = 13,
    SportsInjury = 14,
    LaboratoryAccident = 15,
    FieldTripIncident = 16,
    BehavioralIncident = 17,
    BullyingIncident = 18,
    SecurityIncident = 19,
    FoodSafetyIncident = 20,
    TransportationIncident = 21,
    EmergencyEvacuation = 22,
    VisitorIncident = 23,
    
    Other = 99
}