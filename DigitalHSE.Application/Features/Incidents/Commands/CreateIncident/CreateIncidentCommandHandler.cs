using DigitalHSE.Application.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Commands.CreateIncident;

public class CreateIncidentCommandHandler : ICommandQueryHandler<CreateIncidentCommand, string>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public CreateIncidentCommandHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<string>> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Create the incident with enhanced parameters
            var incident = new Incident(
                request.IncidentDateTime,
                request.Title,
                request.Description,
                request.Category,
                request.Type,
                request.Severity,
                request.Urgency,
                request.Location,
                request.Building,
                request.Department,
                request.ReportedBy,
                request.ReporterEmail,
                request.ReporterType,
                request.IsAnonymous
            );

            // Set detailed location information
            incident.SetLocation(
                request.Location,
                request.Building,
                request.Floor,
                request.Room,
                request.SpecificLocation
            );

            // Set GPS location if provided
            if (request.Latitude.HasValue && request.Longitude.HasValue)
            {
                incident.SetGPSLocation(request.Latitude.Value, request.Longitude.Value);
            }

            // Set QR code location if provided
            if (!string.IsNullOrEmpty(request.QRCodeLocation))
            {
                incident.SetQRCodeLocation(request.QRCodeLocation);
            }

            // Set reporter additional information
            if (!string.IsNullOrEmpty(request.ReporterPhone))
            {
                // Update reporter contact info through domain method if exists
            }

            // Set person affected information
            if (request.PersonAffectedType.HasValue)
            {
                incident.SetPersonAffected(
                    request.PersonAffectedType.Value,
                    request.PersonAffectedName,
                    request.PersonAffectedId,
                    request.PersonAffectedDepartment,
                    request.PersonAffectedClass,
                    request.PersonAffectedAge,
                    request.PersonAffectedContact
                );
            }

            // Add witnesses
            if (request.WitnessNames.Any() || request.WitnessContacts.Any())
            {
                incident.AddWitnesses(request.WitnessNames, request.WitnessContacts);
            }

            // Record immediate response
            if (!string.IsNullOrEmpty(request.ImmediateActions))
            {
                incident.RecordImmediateActions(request.ImmediateActions);
            }

            if (!string.IsNullOrEmpty(request.FirstAidProvided))
            {
                incident.RecordFirstAid(request.FirstAidProvided);
            }

            if (request.EmergencyServicesNotified)
            {
                incident.NotifyEmergencyServices(request.EmergencyServiceType);
            }

            // Set medical treatment information
            incident.SetMedicalTreatment(
                request.RequiresMedicalAttention,
                request.HospitalName,
                request.MedicalTreatmentDetails
            );

            // Set school context
            incident.SetSchoolContext(
                request.ActivityType,
                request.SubjectClass,
                request.TeacherInCharge,
                request.SupervisorPresent,
                request.StudentsPresent
            );

            // Set environmental conditions
            incident.SetEnvironmentalConditions(
                request.WeatherConditions,
                request.LightingConditions
            );

            // Set parent information for student incidents
            if (!string.IsNullOrEmpty(request.ParentGuardianName))
            {
                incident.SetParentInfo(
                    request.ParentGuardianName,
                    request.ParentGuardianContact,
                    request.ParentGuardianEmail,
                    request.ParentPreferredLanguage
                );
            }

            // Add evidence
            if (request.PhotoUrls.Any())
            {
                incident.AddPhotos(request.PhotoUrls);
            }

            if (request.VideoUrls.Any())
            {
                incident.AddVideos(request.VideoUrls);
            }

            if (request.DocumentUrls.Any())
            {
                incident.AddDocuments(request.DocumentUrls);
            }

            // Set regulatory requirements
            incident.SetBPJSReporting(request.RequiresBPJSReporting);
            incident.SetMinistryReporting(request.RequiresMinistryReporting);

            // Save to database
            await _unitOfWork.IncidentRepository.AddAsync(incident);
            await _unitOfWork.SaveChangesAsync();

            // TODO: Add notification logic for immediate parent notification
            if (incident.RequiresImmediateParentNotification())
            {
                // Send immediate notification
            }

            var result = new Result<string>();
            result.AddValue(incident.IncidentNumber);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<string>();
            result.InternalServerError($"Failed to create incident: {ex.Message}");
            return result;
        }
    }
}