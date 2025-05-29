using BuildingBlocks.Application.Features;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetSampleModelTotalCount;

public record GetSampleModelTotalCountQuery(
    ) : ICommandQuery<int>;