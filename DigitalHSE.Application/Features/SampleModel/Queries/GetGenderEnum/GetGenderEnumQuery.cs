using BuildingBlocks.Application.Features;
using BuildingBlocks.Application.ViewModels;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetGenderEnum;

public record GetGenderEnumQuery(
    ) : ICommandQuery<IList<EnumViewModel>>;
