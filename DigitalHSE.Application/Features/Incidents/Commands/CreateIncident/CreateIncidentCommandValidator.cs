using DigitalHSE.Domain.HSE.Enums;
using FluentValidation;

namespace DigitalHSE.Application.Features.Incidents.Commands.CreateIncident;

public class CreateIncidentCommandValidator : AbstractValidator<CreateIncidentCommand>
{
    public CreateIncidentCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Incident title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Incident description is required")
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters");

        RuleFor(x => x.IncidentDateTime)
            .NotEmpty().WithMessage("Incident date and time is required")
            .LessThanOrEqualTo(DateTime.Now).WithMessage("Incident date cannot be in the future");

        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Invalid incident category");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid incident type");

        RuleFor(x => x.Severity)
            .IsInEnum().WithMessage("Invalid incident severity");

        RuleFor(x => x.Urgency)
            .IsInEnum().WithMessage("Invalid incident urgency");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Incident location is required")
            .MaximumLength(100).WithMessage("Location cannot exceed 100 characters");

        RuleFor(x => x.Building)
            .NotEmpty().WithMessage("Building is required")
            .MaximumLength(100).WithMessage("Building cannot exceed 100 characters");

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Department is required")
            .MaximumLength(100).WithMessage("Department cannot exceed 100 characters");

        RuleFor(x => x.ReportedBy)
            .NotEmpty().WithMessage("Reporter name is required")
            .MaximumLength(100).WithMessage("Reporter name cannot exceed 100 characters");

        RuleFor(x => x.ReporterEmail)
            .NotEmpty().WithMessage("Reporter email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.ReporterType)
            .IsInEnum().WithMessage("Invalid reporter type");

        RuleFor(x => x.ReporterPhone)
            .Matches(@"^(\+62|62|0)8[1-9][0-9]{6,9}$")
            .WithMessage("Invalid Indonesian phone number format")
            .When(x => !string.IsNullOrEmpty(x.ReporterPhone));

        // GPS coordinates validation
        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90 degrees")
            .When(x => x.Latitude.HasValue);

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180 degrees")
            .When(x => x.Longitude.HasValue);

        // Person affected validations
        When(x => x.PersonAffectedType.HasValue, () =>
        {
            RuleFor(x => x.PersonAffectedType)
                .IsInEnum().WithMessage("Invalid person affected type");

            RuleFor(x => x.PersonAffectedName)
                .NotEmpty().WithMessage("Person affected name is required")
                .MaximumLength(100).WithMessage("Person affected name cannot exceed 100 characters");
        });

        // Student-specific validations
        When(x => IsStudentIncident(x), () =>
        {
            RuleFor(x => x.PersonAffectedId)
                .NotEmpty().WithMessage("Student ID is required for student incidents");

            RuleFor(x => x.PersonAffectedClass)
                .NotEmpty().WithMessage("Student class is required for student incidents")
                .MaximumLength(20).WithMessage("Student class cannot exceed 20 characters");

            RuleFor(x => x.ParentGuardianContact)
                .NotEmpty().WithMessage("Parent/guardian contact is required for student incidents")
                .Matches(@"^(\+62|62|0)8[1-9][0-9]{6,9}$|^[\w\.-]+@[\w\.-]+\.\w+$")
                .WithMessage("Parent contact must be a valid email or Indonesian phone number");

            RuleFor(x => x.ParentPreferredLanguage)
                .Must(lang => lang == "en" || lang == "id")
                .WithMessage("Parent preferred language must be 'en' or 'id'");
        });

        // Medical attention validations
        When(x => x.RequiresMedicalAttention, () =>
        {
            RuleFor(x => x.HospitalName)
                .NotEmpty().WithMessage("Hospital name is required when medical attention is needed")
                .MaximumLength(100).WithMessage("Hospital name cannot exceed 100 characters");

            RuleFor(x => x.MedicalTreatmentDetails)
                .NotEmpty().WithMessage("Medical treatment details are required when medical attention is needed")
                .MaximumLength(500).WithMessage("Medical treatment details cannot exceed 500 characters");
        });

        // Emergency services validation
        When(x => x.EmergencyServicesNotified, () =>
        {
            RuleFor(x => x.EmergencyServiceType)
                .NotEmpty().WithMessage("Emergency service type is required when emergency services are notified")
                .Must(BeValidEmergencyServiceType)
                .WithMessage("Emergency service type must be 'Police', 'Ambulance', 'Fire', or 'Hospital'");
        });

        // Evidence validations
        RuleFor(x => x.PhotoUrls)
            .Must(photos => photos.Count <= 10)
            .WithMessage("Maximum 10 photos can be uploaded");

        RuleFor(x => x.VideoUrls)
            .Must(videos => videos.Count <= 5)
            .WithMessage("Maximum 5 videos can be uploaded");

        RuleFor(x => x.DocumentUrls)
            .Must(docs => docs.Count <= 10)
            .WithMessage("Maximum 10 documents can be uploaded");

        // Immediate actions validation for serious incidents
        When(x => x.Severity >= IncidentSeverity.Moderate || x.Urgency >= IncidentUrgency.High, () =>
        {
            RuleFor(x => x.ImmediateActions)
                .NotEmpty().WithMessage("Immediate actions are required for moderate or higher severity incidents");
        });

        // Anonymous reporting validation
        When(x => x.IsAnonymous, () =>
        {
            RuleFor(x => x.ReportedBy)
                .Must(name => name == "Anonymous" || string.IsNullOrEmpty(name))
                .WithMessage("Reporter name should be 'Anonymous' for anonymous reports");
        });

        // School context validations
        RuleFor(x => x.StudentsPresent)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Number of students present cannot be negative");

        // Witness validation
        RuleFor(x => x.WitnessNames)
            .Must((command, witnesses) => witnesses.Count == command.WitnessContacts.Count)
            .WithMessage("Number of witness names must match number of witness contacts")
            .When(x => x.WitnessNames.Any() || x.WitnessContacts.Any());
    }

    private bool IsStudentIncident(CreateIncidentCommand command)
    {
        return command.PersonAffectedType == PersonType.Student ||
               command.Category.ToString().Contains("Student") ||
               !string.IsNullOrEmpty(command.PersonAffectedClass);
    }

    private bool BeValidEmergencyServiceType(string serviceType)
    {
        return serviceType == "Police" || serviceType == "Ambulance" || 
               serviceType == "Fire" || serviceType == "Hospital";
    }
}