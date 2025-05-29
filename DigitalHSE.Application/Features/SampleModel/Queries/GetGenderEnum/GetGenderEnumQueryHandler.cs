using BuildingBlocks.Application.Features;
using BuildingBlocks.Application.ViewModels;
using DigitalHSE.Domain.Enums;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetGenderEnum;

public class GetGenderEnumQueryHandler() : 
    GetEnumQueryHandler<GetGenderEnumQuery, GenderEnum>,
    ICommandQueryHandler<GetGenderEnumQuery, IList<EnumViewModel>>
{
}
