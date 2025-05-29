using AnotherDigitalHSE.API.Model;
using Microsoft.EntityFrameworkCore;

namespace AnotherDigitalHSE.API.Services;

public class TestModelService(AnotherDigitalHSEDBContext context) : ITestModelService
{
    public async Task<List<TestModel>> GetAll(CancellationToken cancellationToken)
    {
        return await context.TestModels.ToListAsync(cancellationToken);
    }

    public async Task Add(string name, CancellationToken cancellationToken)
    {
        var test = TestModel.Create(name);
        context.TestModels.Add(test);
        await context.SaveChangesAsync(cancellationToken);
    }
}
