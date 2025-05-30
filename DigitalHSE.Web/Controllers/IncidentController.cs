using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DigitalHSE.Application.Common;
using DigitalHSE.Application.Features.Incidents.Commands.CreateIncident;
using DigitalHSE.Application.Features.Incidents.Commands.StartInvestigation;
using DigitalHSE.Application.Features.Incidents.Commands.CompleteInvestigation;
using DigitalHSE.Application.Features.Incidents.Commands.NotifyParent;
using DigitalHSE.Application.Features.Incidents.Queries.GetIncidentsList;
using DigitalHSE.Application.Features.Incidents.Queries.GetIncidentById;
using DigitalHSE.Application.Features.Incidents.Queries.GetIncidentByTrackingCode;
using DigitalHSE.Application.Features.Incidents.Queries.GetIncidentStatistics;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncidentController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<IncidentController> _logger;

    public IncidentController(IMediator mediator, ILogger<IncidentController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get a paginated list of incidents with advanced filtering
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetIncidents([FromQuery] GetIncidentsListQuery query)
    {
        try
        {
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incidents list");
            return StatusCode(500, new { message = "Error retrieving incidents" });
        }
    }

    /// <summary>
    /// Get a specific incident by ID with full details
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetIncident(int id, [FromQuery] bool includeInvestigations = true, 
        [FromQuery] bool includeCAPAs = true, [FromQuery] bool includeNotifications = true)
    {
        try
        {
            var query = new GetIncidentByIdQuery
            {
                IncidentId = id,
                IncludeInvestigations = includeInvestigations,
                IncludeCAPAs = includeCAPAs,
                IncludeNotifications = includeNotifications
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident {IncidentId}", id);
            return StatusCode(500, new { message = "Error retrieving incident" });
        }
    }

    /// <summary>
    /// Get incident by anonymous tracking code
    /// </summary>
    [HttpGet("tracking/{trackingCode}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetIncidentByTrackingCode(string trackingCode)
    {
        try
        {
            var query = new GetIncidentByTrackingCodeQuery { TrackingCode = trackingCode };
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            if (result.StatusCode == 401)
                return Unauthorized(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident by tracking code {TrackingCode}", trackingCode);
            return StatusCode(500, new { message = "Error retrieving incident" });
        }
    }

    /// <summary>
    /// Get comprehensive incident statistics and analytics
    /// </summary>
    [HttpGet("statistics")]
    public async Task<IActionResult> GetIncidentStatistics([FromQuery] GetIncidentStatisticsQuery query)
    {
        try
        {
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident statistics");
            return StatusCode(500, new { message = "Error retrieving statistics" });
        }
    }

    /// <summary>
    /// Create a new incident report
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateIncident([FromBody] CreateIncidentCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
                return CreatedAtAction(nameof(GetIncident), new { id = result.Value }, 
                    new { incidentNumber = result.Value, message = "Incident created successfully" });
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating incident");
            return StatusCode(500, new { message = "Error creating incident" });
        }
    }

    /// <summary>
    /// Create an anonymous incident report
    /// </summary>
    [HttpPost("anonymous")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateAnonymousIncident([FromBody] CreateIncidentCommand command)
    {
        try
        {
            // Ensure anonymous flag is set
            var anonymousCommand = command with { 
                IsAnonymous = true,
                ReportedBy = "Anonymous",
                ReporterEmail = command.ReporterEmail.Contains("@") ? command.ReporterEmail : "anonymous@report.local"
            };

            var result = await _mediator.Send(anonymousCommand);
            
            if (result.IsSuccess)
                return Ok(new { 
                    incidentNumber = result.Value,
                    message = "Anonymous incident report submitted successfully. Save your incident number for tracking." 
                });
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating anonymous incident");
            return StatusCode(500, new { message = "Error creating incident report" });
        }
    }

    /// <summary>
    /// Start an investigation for an incident
    /// </summary>
    [HttpPost("{id:int}/investigate")]
    public async Task<IActionResult> StartInvestigation(int id, [FromBody] StartInvestigationCommand command)
    {
        try
        {
            var investigationCommand = command with { IncidentId = id };
            var result = await _mediator.Send(investigationCommand);
            
            if (result.IsSuccess)
                return Ok(new { message = "Investigation started successfully" });
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting investigation for incident {IncidentId}", id);
            return StatusCode(500, new { message = "Error starting investigation" });
        }
    }

    /// <summary>
    /// Complete an investigation for an incident
    /// </summary>
    [HttpPost("{id:int}/complete-investigation")]
    public async Task<IActionResult> CompleteInvestigation(int id, [FromBody] CompleteInvestigationCommand command)
    {
        try
        {
            var completionCommand = command with { IncidentId = id };
            var result = await _mediator.Send(completionCommand);
            
            if (result.IsSuccess)
                return Ok(new { message = "Investigation completed successfully" });
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing investigation for incident {IncidentId}", id);
            return StatusCode(500, new { message = "Error completing investigation" });
        }
    }

    /// <summary>
    /// Send notification to parent/guardian for student incidents
    /// </summary>
    [HttpPost("{id:int}/notify-parent")]
    public async Task<IActionResult> NotifyParent(int id, [FromBody] NotifyParentCommand command)
    {
        try
        {
            var notificationCommand = command with { IncidentId = id };
            var result = await _mediator.Send(notificationCommand);
            
            if (result.IsSuccess)
                return Ok(new { message = "Parent notification sent successfully" });
            
            if (result.StatusCode == 404)
                return NotFound(result.ErrorMessages);
                
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending parent notification for incident {IncidentId}", id);
            return StatusCode(500, new { message = "Error sending notification" });
        }
    }

    /// <summary>
    /// Get incident categories for dropdown lists
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    public IActionResult GetIncidentCategories()
    {
        try
        {
            var categories = Enum.GetValues<IncidentCategory>()
                .Select(c => new { value = (int)c, name = c.ToString(), display = c.ToString().Replace('_', ' ') })
                .ToList();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident categories");
            return StatusCode(500, new { message = "Error retrieving categories" });
        }
    }

    /// <summary>
    /// Get incident types for dropdown lists
    /// </summary>
    [HttpGet("types")]
    [AllowAnonymous]
    public IActionResult GetIncidentTypes()
    {
        try
        {
            var types = Enum.GetValues<IncidentType>()
                .Select(t => new { value = (int)t, name = t.ToString(), display = t.ToString().Replace('_', ' ') })
                .ToList();

            return Ok(types);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident types");
            return StatusCode(500, new { message = "Error retrieving types" });
        }
    }

    /// <summary>
    /// Get severity levels for dropdown lists
    /// </summary>
    [HttpGet("severities")]
    [AllowAnonymous]
    public IActionResult GetIncidentSeverities()
    {
        try
        {
            var severities = Enum.GetValues<IncidentSeverity>()
                .Select(s => new { value = (int)s, name = s.ToString(), display = s.ToString() })
                .ToList();

            return Ok(severities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident severities");
            return StatusCode(500, new { message = "Error retrieving severities" });
        }
    }

    /// <summary>
    /// Get urgency levels for dropdown lists
    /// </summary>
    [HttpGet("urgencies")]
    [AllowAnonymous]
    public IActionResult GetIncidentUrgencies()
    {
        try
        {
            var urgencies = Enum.GetValues<IncidentUrgency>()
                .Select(u => new { value = (int)u, name = u.ToString(), display = u.ToString() })
                .ToList();

            return Ok(urgencies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving incident urgencies");
            return StatusCode(500, new { message = "Error retrieving urgencies" });
        }
    }

    /// <summary>
    /// Get person types for dropdown lists
    /// </summary>
    [HttpGet("person-types")]
    [AllowAnonymous]
    public IActionResult GetPersonTypes()
    {
        try
        {
            var personTypes = Enum.GetValues<PersonType>()
                .Select(p => new { value = (int)p, name = p.ToString(), display = p.ToString() })
                .ToList();

            return Ok(personTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving person types");
            return StatusCode(500, new { message = "Error retrieving person types" });
        }
    }

    /// <summary>
    /// Get incidents requiring immediate attention (dashboard widget)
    /// </summary>
    [HttpGet("urgent")]
    public async Task<IActionResult> GetUrgentIncidents()
    {
        try
        {
            var query = new GetIncidentsListQuery
            {
                PageSize = 10,
                IsOverdue = true,
                SortBy = "IncidentDateTime",
                SortDirection = "desc"
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving urgent incidents");
            return StatusCode(500, new { message = "Error retrieving urgent incidents" });
        }
    }

    /// <summary>
    /// Get recent incidents (dashboard widget)
    /// </summary>
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentIncidents([FromQuery] int count = 5)
    {
        try
        {
            var query = new GetIncidentsListQuery
            {
                PageSize = count,
                SortBy = "IncidentDateTime",
                SortDirection = "desc"
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
                return Ok(result.Value);
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recent incidents");
            return StatusCode(500, new { message = "Error retrieving recent incidents" });
        }
    }

    /// <summary>
    /// Export incidents to Excel/CSV (placeholder for file export)
    /// </summary>
    [HttpGet("export")]
    public async Task<IActionResult> ExportIncidents([FromQuery] GetIncidentsListQuery query, [FromQuery] string format = "excel")
    {
        try
        {
            // Set a large page size for export
            var exportQuery = query with { PageSize = 10000 };
            var result = await _mediator.Send(exportQuery);
            
            if (result.IsSuccess)
            {
                // TODO: Implement actual file export logic
                return Ok(new { 
                    message = "Export functionality will be implemented", 
                    totalRecords = result.Value != null ? result.Value.TotalCount : 0,
                    format = format 
                });
            }
            
            return BadRequest(result.ErrorMessages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting incidents");
            return StatusCode(500, new { message = "Error exporting incidents" });
        }
    }
}