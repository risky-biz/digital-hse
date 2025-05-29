using BuildingBlocks.Application.Features;

namespace DigitalHSE.Application.Features.SampleModel.Commands.DeleteSampleModel;

public record DeleteSampleModelCommand(
    int Id
    ) : ICommandQuery;