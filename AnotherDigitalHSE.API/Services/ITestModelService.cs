using AnotherDigitalHSE.API.Model;

namespace AnotherDigitalHSE.API.Services;

public interface ITestModelService
{
    Task<List<TestModel>> GetAll(CancellationToken cancellationToken);
    Task Add(string name, CancellationToken cancellationToken);
}
