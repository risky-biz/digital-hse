using BuildingBlocks.Application.Features;
using DigitalHSE.Application.ViewModels;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetSampleModelById;

public record GetSampleModelByIdQuery(
    int Id
    ) : ICommandQuery<SampleModelViewModel>;
