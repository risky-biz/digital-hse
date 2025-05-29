using BuildingBlocks.Application.Features;
using DigitalHSE.Application.ViewModels;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetAllSampleModels;

public class GetAllSampleModelsQueryHandler(IDigitalHSEUnitOfWork unitOfWork) : ICommandQueryHandler<GetAllSampleModelsQuery, IReadOnlyList<SampleModelViewModel>>
{
    public async Task<Result<IReadOnlyList<SampleModelViewModel>>> Handle(GetAllSampleModelsQuery request, CancellationToken cancellationToken)
    {
        var entities = await unitOfWork.SampleModelRepository.GetAllAsync(cancellationToken);
        var viewModels = entities.ToViewModel();

        var result = new Result<IReadOnlyList<SampleModelViewModel>>();
        result.AddValue(viewModels);
        result.OK();
        return result;
    }
}