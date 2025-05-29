using BuildingBlocks.Application.Features;
using DigitalHSE.Application.ViewModels;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetAllSampleModels;

public record GetAllSampleModelsQuery(
    ) : ICommandQuery<IReadOnlyList<SampleModelViewModel>>;
