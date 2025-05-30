using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DigitalHSE.Application.Common;
using DigitalHSE.Application.Features.Incidents.Commands.StartInvestigation;
using DigitalHSE.Application.Features.Incidents.Commands.CompleteInvestigation;
using DigitalHSE.Application.Features.Incidents.Queries.GetIncidentsList;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvestigationController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<InvestigationController> _logger;

    public InvestigationController(IMediator mediator, ILogger<InvestigationController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get all incidents pending investigation
    /// </summary>
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingInvestigations([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = new GetIncidentsListQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                InvestigationStatus = InvestigationStatus.NotStarted,
                SortBy = "IncidentDateTime",
                SortDirection = "asc"
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending investigations");
            return StatusCode(500, new { message = "Error retrieving pending investigations" });
        }
    }

    /// <summary>
    /// Get all active investigations
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveInvestigations([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = new GetIncidentsListQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                InvestigationStatus = InvestigationStatus.InProgress,
                SortBy = "InvestigationStartDate",
                SortDirection = "asc"
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active investigations");
            return StatusCode(500, new { message = "Error retrieving active investigations" });
        }
    }

    /// <summary>
    /// Get overdue investigations
    /// </summary>
    [HttpGet("overdue")]
    public async Task<IActionResult> GetOverdueInvestigations([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = new GetIncidentsListQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                IsOverdue = true,
                SortBy = "InvestigationDueDate",
                SortDirection = "asc"
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving overdue investigations");
            return StatusCode(500, new { message = "Error retrieving overdue investigations" });
        }
    }

    /// <summary>
    /// Get completed investigations
    /// </summary>
    [HttpGet("completed")]
    public async Task<IActionResult> GetCompletedInvestigations([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = new GetIncidentsListQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                InvestigationStatus = InvestigationStatus.Completed,
                SortBy = "InvestigationCompletedDate",
                SortDirection = "desc"
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving completed investigations");
            return StatusCode(500, new { message = "Error retrieving completed investigations" });
        }
    }

    /// <summary>
    /// Start an investigation
    /// </summary>
    [HttpPost("{incidentId:int}/start")]
    public async Task<IActionResult> StartInvestigation(int incidentId, [FromBody] StartInvestigationCommand command)
    {
        try
        {
            var investigationCommand = command with { IncidentId = incidentId };
            var result = await _mediator.Send(investigationCommand);
            
            if (result.IsSuccess)
                return Ok(new { message = "Investigation started successfully" });
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting investigation for incident {IncidentId}", incidentId);
            return StatusCode(500, new { message = "Error starting investigation" });
        }
    }

    /// <summary>
    /// Complete an investigation
    /// </summary>
    [HttpPost("{incidentId:int}/complete")]
    public async Task<IActionResult> CompleteInvestigation(int incidentId, [FromBody] CompleteInvestigationCommand command)
    {
        try
        {
            var completionCommand = command with { IncidentId = incidentId };
            var result = await _mediator.Send(completionCommand);
            
            if (result.IsSuccess)
                return Ok(new { message = "Investigation completed successfully" });
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing investigation for incident {IncidentId}", incidentId);
            return StatusCode(500, new { message = "Error completing investigation" });
        }
    }

    /// <summary>
    /// Get investigation dashboard statistics
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetInvestigationDashboard()
    {
        try
        {
            // Get counts for different investigation statuses
            var pendingQuery = new GetIncidentsListQuery { InvestigationStatus = InvestigationStatus.NotStarted, PageSize = 1 };
            var activeQuery = new GetIncidentsListQuery { InvestigationStatus = InvestigationStatus.InProgress, PageSize = 1 };
            var overdueQuery = new GetIncidentsListQuery { IsOverdue = true, PageSize = 1 };
            var completedQuery = new GetIncidentsListQuery { InvestigationStatus = InvestigationStatus.Completed, PageSize = 1 };

            var pendingResult = await _mediator.Send(pendingQuery);
            var activeResult = await _mediator.Send(activeQuery);
            var overdueResult = await _mediator.Send(overdueQuery);
            var completedResult = await _mediator.Send(completedQuery);

            var pendingCount = pendingResult.IsSuccess && pendingResult.Value != null ? pendingResult.Value.TotalCount : 0;
            var activeCount = activeResult.IsSuccess && activeResult.Value != null ? activeResult.Value.TotalCount : 0;
            var overdueCount = overdueResult.IsSuccess && overdueResult.Value != null ? overdueResult.Value.TotalCount : 0;
            var completedCount = completedResult.IsSuccess && completedResult.Value != null ? completedResult.Value.TotalCount : 0;

            var dashboard = new
            {
                pendingInvestigations = pendingCount,
                activeInvestigations = activeCount,
                overdueInvestigations = overdueCount,
                completedInvestigations = completedCount,
                totalInvestigations = pendingCount + activeCount + overdueCount + completedCount
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving investigation dashboard");
            return StatusCode(500, new { message = "Error retrieving investigation dashboard" });
        }
    }

    /// <summary>
    /// Assign investigator to an incident
    /// </summary>
    [HttpPost("{incidentId:int}/assign")]
    public async Task<IActionResult> AssignInvestigator(int incidentId, [FromBody] AssignInvestigatorRequest request)
    {
        try
        {
            var command = new StartInvestigationCommand
            {
                IncidentId = incidentId,
                InvestigatedBy = request.InvestigatorName,
                InvestigatorEmail = request.InvestigatorEmail,
                InvestigatorRole = request.InvestigatorRole,
                TargetCompletionDate = request.TargetCompletionDate,
                InitialNotes = request.InitialNotes
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
                return Ok(new { message = "Investigator assigned successfully" });
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning investigator to incident {IncidentId}", incidentId);
            return StatusCode(500, new { message = "Error assigning investigator" });
        }
    }
}

public class AssignInvestigatorRequest
{
    public string InvestigatorName { get; set; } = string.Empty;
    public string InvestigatorEmail { get; set; } = string.Empty;
    public string InvestigatorRole { get; set; } = string.Empty;
    public DateTime? TargetCompletionDate { get; set; }
    public string InitialNotes { get; set; } = string.Empty;
}