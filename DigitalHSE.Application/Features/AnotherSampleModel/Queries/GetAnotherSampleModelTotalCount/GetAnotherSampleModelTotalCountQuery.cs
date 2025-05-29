using BuildingBlocks.Application.Features;

namespace DigitalHSE.Application.Features.AnotherSampleModel.Queries.GetAnotherSampleModelTotalCount;

public record GetAnotherSampleModelTotalCountQuery(
) : ICommandQuery<int>;