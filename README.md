# Digital HSE System

🛡️ **Digital HSE** is a comprehensive Health, Safety, and Environment management system built for educational institutions, specifically designed for The British School Jakarta. This system provides a complete platform for managing incidents, risk assessments, permits, compliance, and training records.

---

## 🌟 Key Features

### Core HSE Modules
- **Incident Management**: Report, track, and investigate safety incidents
- **Risk Assessment**: Identify and evaluate workplace hazards
- **Permit to Work**: Manage work permits for high-risk activities
- **Compliance Tracking**: Monitor regulatory compliance requirements
- **Training Records**: Track safety training and certifications

### Technical Features
- **Modern Architecture**: Clean Architecture with Domain-Driven Design (DDD)
- **Full-Stack Solution**: .NET 8 backend with React TypeScript frontend
- **Database**: PostgreSQL 17 with Entity Framework Core
- **Authentication**: JWT-based authentication with role-based access
- **Real-time Updates**: SignalR for live notifications
- **Multi-language**: Support for English and Bahasa Indonesia
- **Responsive UI**: CoreUI React framework for modern, mobile-friendly interface

---

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 17 (or use Docker)

### Running with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/digital-hse.git
cd digital-hse
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. Run database migrations:
```bash
dotnet ef database update --project DigitalHSE.Infrastructure --startup-project DigitalHSE.Web
```

4. Access the application:
- Web Application: http://localhost:5228
- React Dev Server: http://localhost:3000 (for development)
- PgAdmin: http://localhost:5050
- Swagger API: http://localhost:5228/swagger

### WSL2 Network Port Forwarding (Windows only)

If you're running the application in WSL2 and need to access it from other devices on your network, you'll need to set up port forwarding:

```bash
# Forward port 5000 from host to WSL2 instance
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.18.214.238
```

**Purpose**: This command creates a port proxy that forwards traffic from port 5000 on all network interfaces (0.0.0.0) of your Windows host to port 5000 on the WSL2 virtual machine (IP: 172.18.214.238). This allows:

- **External Access**: Other devices on your network can access the application using your Windows machine's IP address
- **Mobile Testing**: Test the responsive UI on mobile devices connected to the same network
- **Team Development**: Allow team members to access your development instance for testing

**Note**: Replace `172.18.214.238` with your actual WSL2 IP address. You can find it by running `ip addr show eth0` in WSL2 or `wsl hostname -I` in Windows PowerShell.

**To remove the port forwarding when no longer needed:**
```bash
netsh interface portproxy delete v4tov4 listenport=5000 listenaddress=0.0.0.0
```

### Connecting to PgAdmin

1. Open your browser and navigate to http://localhost:5050
2. Login with:
   - Email: `admin@digitalhse.com`
   - Password: `admin123`
3. To connect to the PostgreSQL database:
   - Click "Add New Server"
   - General Tab:
     - Name: `DigitalHSE` (or any name you prefer)
   - Connection Tab:
     - Host: `digitalhse.db` (Docker service name)
     - Port: `5432`
     - Maintenance database: `postgres`
     - Username: `postgres`
     - Password: `postgres`
   - Click "Save"

### Development Setup

1. Install frontend dependencies:
```bash
cd DigitalHSE.Web/ClientApp
npm install
```

2. Run the application (multiple options):

**Option A: Default Development (auto-builds React)**
```bash
cd DigitalHSE.Web
dotnet run
# React app automatically built and served at http://localhost:5000
```

**Option B: Fast Development (skip React build for faster startup)**
```bash
cd DigitalHSE.Web
dotnet run -p:BuildReactApp=false
# API only at http://localhost:5000/swagger
```

**Option C: Separate Frontend/Backend Development (best for active UI development)**
```bash
# Terminal 1: Run .NET backend (API only)
cd DigitalHSE.Web
dotnet run -p:BuildReactApp=false

# Terminal 2: Run React dev server with hot reload
cd DigitalHSE.Web/ClientApp
npm start
# React app with hot reload at http://localhost:3000
```

**Option D: Force React Build (even in Release mode)**
```bash
cd DigitalHSE.Web
dotnet run -c Release -p:BuildReactApp=true
```

3. Seed test users:
```bash
curl -X POST http://localhost:5000/api/seed/users
```

#### Development Mode Comparison

| Mode | React Build | Startup Speed | Use Case |
|------|-------------|---------------|----------|
| Default (`dotnet run`) | ✅ Auto | Medium | General development |
| Fast (`-p:BuildReactApp=false`) | ❌ Skip | Fast | Backend-only changes |
| Separate (`npm start` + backend) | ❌ Skip | Fast | Active UI development |
| Force (`-p:BuildReactApp=true`) | ✅ Always | Medium | Testing production build |

### Default Test Accounts
- **Admin**: admin / admin123
- **HSE Manager**: hsemanager / hse123
- **HSE Officer**: hseofficer / hse123
- **Teacher**: teacher / teacher123
- **Student**: student / student123

---

## 🏗️ Architecture

### Clean Architecture Layers
1. **Domain Layer**: Core business entities and interfaces
2. **Application Layer**: Use cases, CQRS commands/queries, business logic
3. **Infrastructure Layer**: Data access, external services, persistence
4. **Web Layer**: REST API endpoints and React SPA

### Technology Stack
- **Backend**: .NET 8, Entity Framework Core, Dapper
- **Frontend**: React 18, TypeScript, CoreUI
- **Database**: PostgreSQL 17
- **Caching**: Redis
- **Message Queue**: RabbitMQ
- **Logging**: Elasticsearch + Kibana
- **Monitoring**: Prometheus + Grafana
- **Containerization**: Docker & Docker Compose

---

## 📚 Documentation

- **API Documentation**: Available at `/swagger` when running the application
- **Architecture Guide**: See `CLAUDE.md` for detailed architecture documentation
- **Database Schema**: Check migrations in `DigitalHSE.Infrastructure/Migrations`

---

## 🛠️ Infrastructure Services

The complete stack includes:
- **PostgreSQL**: Primary database (port 5432)
- **PgAdmin**: Database management UI (port 5050)
- **Redis**: Caching and session storage (port 6379)
- **RabbitMQ**: Message queue (ports 5672, 15672)
- **Elasticsearch**: Log aggregation (port 9200)
- **Kibana**: Log visualization (port 5601)
- **Prometheus**: Metrics collection (port 9090)
- **Grafana**: Monitoring dashboards (port 3000)

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or create issues for bugs and feature requests.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Contact

- **Project Lead**: The British School Jakarta HSE Department
- **Technical Support**: IT Department
