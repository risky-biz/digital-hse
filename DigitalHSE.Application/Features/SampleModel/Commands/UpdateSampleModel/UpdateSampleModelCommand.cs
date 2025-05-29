using BuildingBlocks.Application.Features;
using DigitalHSE.Domain.Enums;

namespace DigitalHSE.Application.Features.SampleModel.Commands.UpdateSampleModel;

public record UpdateSampleModelCommand(
    int Id,
    string FirstName,
    string LastName,
    int Age,
    GenderEnum Gender,
    string Address
    ) : ICommandQuery;