# Build Process Documentation

## React App Building and Asset Management

This project includes automated React app building and asset management to ensure clean deployments.

## Build Commands

### Development Build with React App
```bash
# Build with React app (cleans wwwroot before copying)
dotnet run -p:BuildReactApp=true

# Or using build command
dotnet build -p:BuildReactApp=true
```

### Production Build
```bash
# Publish (automatically builds and cleans React assets)
dotnet publish -c Release
```

### Manual Asset Cleanup
```bash
# Clean React assets manually
dotnet build -t:CleanReactAssets
```

## What Happens During Build

### When `BuildReactApp=true`:

1. **Clean wwwroot directory**
   - Removes all files and folders in `wwwroot/`
   - Preserves specific files if configured (favicon.ico, robots.txt)
   - Ensures no stale assets remain

2. **Install Node dependencies**
   - Runs `npm install` if `node_modules` doesn't exist
   - Ensures all React dependencies are available

3. **Build React application**
   - Runs `npm run build` in the ClientApp directory
   - Creates optimized production build in `ClientApp/build/`

4. **Copy assets to wwwroot**
   - Copies all files from `ClientApp/build/` to `wwwroot/`
   - Maintains directory structure

### During Publish:

1. **Clean React build directory**
   - Removes `ClientApp/build/` to ensure fresh build

2. **Build React app**
   - Fresh npm install and build

3. **Include in publish output**
   - Copies React assets to publish directory

## File Preservation

By default, the following files are preserved during cleanup:
- `wwwroot/favicon.ico`
- `wwwroot/robots.txt`

To preserve additional files, update the `FilesToKeep` ItemGroup in `DigitalHSE.Web.csproj`:

```xml
<ItemGroup>
  <FilesToKeep Include="wwwroot\favicon.ico" />
  <FilesToKeep Include="wwwroot\robots.txt" />
  <FilesToKeep Include="wwwroot\your-custom-file.txt" />
</ItemGroup>
```

## Benefits

1. **No Stale Assets**: Old JavaScript, CSS, and asset files are completely removed
2. **Cache Busting**: Fresh builds ensure browsers load new versions
3. **Clean Deployments**: No orphaned files from previous builds
4. **Automated Process**: Happens automatically during build/publish

## Troubleshooting

### Build Fails During Cleanup
If the cleanup process fails, you can manually clean assets:
```bash
dotnet build -t:CleanReactAssets
```

### Node/NPM Issues
Ensure Node.js and npm are installed and accessible:
```bash
node --version
npm --version
```

### Permission Issues
On Windows/WSL, ensure the build process has write permissions to the wwwroot directory.

## Configuration

The React build behavior is controlled by the `BuildReactApp` property:
- `true`: Build and copy React app
- `false`: Skip React build (for development with proxy)

This defaults to:
- `Debug` configuration: `true`
- `Release` configuration: `false` (unless explicitly set)

You can override this in several ways:

```bash
# Force build React app
dotnet run -p:BuildReactApp=true

# Skip building React app  
dotnet run -p:BuildReactApp=false

# Use environment variable
set BuildReactApp=true
dotnet run
```