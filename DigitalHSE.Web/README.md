# DigitalHSE.Web - Frontend Application

This is the unified frontend and backend project for the Digital HSE Management System, built with .NET 8 and CoreUI React with TypeScript.

## Architecture

- **Backend**: ASP.NET Core 8 Web API
- **Frontend**: React 18 with TypeScript and CoreUI 5
- **SPA Hosting**: Integrated using ASP.NET Core SPA services
- **Styling**: CoreUI with HSE-specific customizations

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- Visual Studio 2022 / VS Code / JetBrains Rider

## Getting Started

### Install Dependencies

```bash
# Install .NET dependencies
dotnet restore

# Install React dependencies
cd ClientApp
npm install
cd ..
```

### Development Mode

#### Option 1: Using VS Code Tasks (Recommended)
Press `Ctrl+Shift+B` and select "Run Full Stack" to start both backend and frontend.

#### Option 2: Manual Commands
```bash
# Terminal 1: Run the .NET backend
dotnet watch run

# Terminal 2: Run the React frontend (from ClientApp folder)
cd ClientApp
npm start
```

The application will be available at:
- Backend API: https://localhost:5001/swagger
- Frontend: http://localhost:3000 (proxied through .NET in dev mode)

### Production Build

```bash
# Build both frontend and backend
dotnet publish -c Release

# The output will include the compiled React app in wwwroot
```

## Project Structure

```
DigitalHSE.Web/
├── ClientApp/                 # React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── hse/         # HSE-specific components
│   │   ├── views/           # Page components
│   │   ├── services/        # API integration
│   │   ├── hooks/          # Custom React hooks
│   │   ├── scss/           # Styles and themes
│   │   └── _nav.tsx        # Navigation configuration
│   └── package.json
├── Controllers/              # API controllers
├── Program.cs               # Application entry point
└── appsettings.json        # Configuration
```

## Key Features

### HSE-Specific Components
- Risk Matrix visualization
- Incident reporting forms
- Permit management system
- Safety dashboard widgets
- Compliance tracking

### API Integration
All API calls are centralized in `ClientApp/src/services/api.ts` with:
- Automatic authentication token handling
- Request/response interceptors
- Type-safe API methods

### Styling
Custom HSE color scheme defined in `ClientApp/src/scss/_custom.scss`:
- Primary: HSE Green (#1b5e20)
- Danger: Red for high-risk items
- Warning: Orange for medium-risk items
- Success: Green for compliant items

## Development Tips

1. **Type Generation**: Generate TypeScript types from C# models:
   ```bash
   cd ClientApp
   npm run generate-types
   ```

2. **Hot Reload**: Both backend (C#) and frontend (React) support hot reload in development mode.

3. **API Testing**: Use Swagger UI at `/swagger` to test API endpoints.

4. **Component Development**: Use CoreUI's component library for consistent UI.

## Troubleshooting

- **Port conflicts**: If port 3000 or 5001 is in use, update the ports in `launchSettings.json` and `package.json`
- **CORS issues**: Ensure the React dev server URL is included in the CORS policy in `Program.cs`
- **Build errors**: Run `dotnet clean` and delete `node_modules`, then reinstall dependencies

## Additional Resources

- [CoreUI React Documentation](https://coreui.io/react/docs/)
- [ASP.NET Core SPA Services](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa-services)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)