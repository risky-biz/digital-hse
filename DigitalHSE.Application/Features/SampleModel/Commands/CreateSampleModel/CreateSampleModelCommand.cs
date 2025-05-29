using BuildingBlocks.Application.Features;
using DigitalHSE.Domain.Enums;

namespace DigitalHSE.Application.Features.SampleModel.Commands.CreateSampleModel;

public record CreateSampleModelCommand(
    string FirstName,
    string LastName,
    int Age,
    GenderEnum Gender,
    string Address
    ) : ICommandQuery;