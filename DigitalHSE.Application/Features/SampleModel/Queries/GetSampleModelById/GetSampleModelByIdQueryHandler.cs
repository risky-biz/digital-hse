using BuildingBlocks.Application.Exceptions;
using BuildingBlocks.Application.Features;
using DigitalHSE.Application.ViewModels;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.SampleModel.Queries.GetSampleModelById;

public class GetSampleModelByIdQueryHandler(IDigitalHSEUnitOfWork unitOfWork) : ICommandQueryHandler<GetSampleModelByIdQuery, SampleModelViewModel>
{
    public async Task<Result<SampleModelViewModel>> Handle(GetSampleModelByIdQuery request, CancellationToken cancellationToken)
    {
        var existEntity = await unitOfWork.SampleModelRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(BuildingBlocks.Resources.Messages.NotFound);

        var viewModel = existEntity.ToViewModel();

        var result = new Result<SampleModelViewModel>();
        result.AddValue(viewModel);
        result.OK();
        return result;
    }
}