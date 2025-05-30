using Microsoft.AspNetCore.Mvc;
using DigitalHSE.Application.Common;
using DigitalHSE.Application.Features.Incidents.Queries.GetIncidentStatistics;

namespace DigitalHSE.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TestController> _logger;

    public TestController(IMediator mediator, ILogger<TestController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("mediator")]
    public async Task<IActionResult> TestMediator()
    {
        try
        {
            _logger.LogInformation("Testing custom mediator implementation");
            
            var query = new GetIncidentStatisticsQuery
            {
                DateFrom = DateTime.UtcNow.AddMonths(-1),
                DateTo = DateTime.UtcNow
            };

            var result = await _mediator.Send(query);
            
            return Ok(new
            {
                Message = "Custom mediator is working!",
                Success = result.IsSuccess,
                Data = result.Value
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing mediator");
            return StatusCode(500, new { Error = ex.Message });
        }
    }
}