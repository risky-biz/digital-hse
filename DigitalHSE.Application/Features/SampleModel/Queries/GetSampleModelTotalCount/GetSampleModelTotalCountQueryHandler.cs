using BuildingBlocks.Application.Features;
using DigitalHSE.Domain.Interfaces;
using StackExchange.Redis;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetSampleModelTotalCount;

public class GetSampleModelTotalCountQueryHandler(
    IDigitalHSEUnitOfWork unitOfWork,
    IConnectionMultiplexer connectionMultiplexer
    ) : ICommandQueryHandler<GetSampleModelTotalCountQuery, int>
{
    private readonly IDatabase redisDatabase = connectionMultiplexer.GetDatabase();

    public async Task<Result<int>> Handle(GetSampleModelTotalCountQuery request, CancellationToken cancellationToken)
    {
        int totalCount;

        var cachedValue = await redisDatabase.StringGetAsync("SampleModelTotalCount");
        if (cachedValue.HasValue)
        {
            totalCount = int.Parse(cachedValue!);
        }
        else
        {
            totalCount = await unitOfWork.SampleModelRepository.GetTotalCount(cancellationToken);
            await redisDatabase.StringSetAsync("SampleModelTotalCount", totalCount);
        }

        var result = new Result<int>();
        result.AddValue(totalCount);
        result.OK();
        return result;
    }
}