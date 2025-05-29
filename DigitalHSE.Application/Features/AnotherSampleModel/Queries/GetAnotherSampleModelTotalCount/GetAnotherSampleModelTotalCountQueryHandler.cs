using BuildingBlocks.Application.Features;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.AnotherSampleModel.Queries.GetAnotherSampleModelTotalCount;

public class GetAnotherSampleModelTotalCountQueryHandler(IDigitalHSEUnitOfWork unitOfWork) : ICommandQueryHandler<GetAnotherSampleModelTotalCountQuery, int>
{
    public async Task<Result<int>> Handle(GetAnotherSampleModelTotalCountQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await unitOfWork.AnotherSampleModelRepository.GetTotalCount(cancellationToken);

        var result = new Result<int>();
        result.AddValue(totalCount);
        result.OK();
        return result;
    }
}