using BuildingBlocks.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using DigitalHSE.Domain.Models;

namespace DigitalHSE.Infrastructure;

public class DigitalHSEDBContext(
    DbContextOptions<DigitalHSEDBContext> options
    ) : DBContext(options)
{
    public DbSet<SampleModel> SampleModels { get; set; }
    public DbSet<AnotherSampleModel> AnotherSampleModels { get; set; }
}
