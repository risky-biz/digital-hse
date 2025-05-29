using BuildingBlocks.Application.Features;

namespace DigitalHSE.Application.Features.Authentication.Login;

public record LoginCommand(
    string UserName,
    string Password
    ) : ICommandQuery<string>;
