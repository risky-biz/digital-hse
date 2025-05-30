# Epic: Dynamic Module Management System - Comprehensive Requirements Document

## Document Control
- **Version:** 1.0
- **Creation Date:** January 30, 2025
- **Author:** Tech Lead & Solution Architect
- **Document Type:** Technical Requirements & Architecture Specification
- **Status:** Draft for Review
- **Epic Priority:** HIGH - Foundation for Modular Business Model

---

## 📋 **EXECUTIVE SUMMARY**

### **Business Objective**
Design and implement a comprehensive module management system that enables dynamic activation/deactivation of Digital HSE application modules through an administrative interface, supporting a modular business model where clients can purchase and activate only the modules they need.

### **Strategic Value**
- **Revenue Model**: Enable module-based licensing and pricing
- **Scalability**: Support future module additions without code changes
- **User Experience**: Simplified interface showing only relevant modules
- **Administration**: Centralized control over feature availability
- **Compliance**: Role-based access control for configuration changes

### **Success Criteria**
1. ✅ Dynamic module toggle system operational
2. ✅ Role-based access control for "Developer" and "Super Admin" roles
3. ✅ Real-time sidebar navigation updates
4. ✅ Persistent module state across sessions
5. ✅ Scalable architecture for future modules
6. ✅ Zero downtime module activation/deactivation

---

## 🏗️ **CURRENT ARCHITECTURE ANALYSIS**

### **Existing System Overview**
Based on comprehensive codebase analysis, the Digital HSE system currently includes:

**Current Modules Identified:**
1. **Dashboard Module** - Central HSE metrics and overview
2. **Incident Management** - Report, track, investigate incidents
3. **Risk Management** - Risk assessments and control measures
4. **Permit to Work** - Work permit management system
5. **Training Module** - Training records and certifications
6. **Document Management** - HSE document library
7. **Compliance Module** - Regulatory compliance tracking
8. **Analytics Module** - Reports and data visualization

**Current Navigation Structure:**
```typescript
// From _nav.tsx - Static navigation configuration
const _nav = [
  { component: CNavItem, name: 'Dashboard', to: '/dashboard' },
  { component: CNavTitle, name: 'Safety Management' },
  { component: CNavGroup, name: 'Incidents', items: [...] },
  { component: CNavGroup, name: 'Risk Management', items: [...] },
  { component: CNavItem, name: 'Permit to Work', to: '/permits' },
  { component: CNavTitle, name: 'Compliance' },
  { component: CNavItem, name: 'Training', to: '/training' },
  { component: CNavItem, name: 'Documents', to: '/documents' },
  { component: CNavItem, name: 'Compliance', to: '/compliance' },
  { component: CNavTitle, name: 'Analytics' },
  { component: CNavItem, name: 'Reports & Analytics', to: '/analytics' }
]
```

**Current Role System:**
- System Administrator (ID: 1)
- HSE Manager (ID: 2) 
- HSE Officer (ID: 3)
- Teacher (ID: 4)
- Support Staff (ID: 5)

**Technology Stack:**
- **Backend**: ASP.NET Core 8, Entity Framework Core, PostgreSQL
- **Frontend**: React 18, TypeScript, CoreUI 5
- **Authentication**: JWT with role-based authorization
- **Architecture**: Clean Architecture with CQRS pattern

---

## 🎯 **FUNCTIONAL REQUIREMENTS**

### **FR-001: Module Configuration Management**

**Description:** Administrative interface for managing module availability

**Requirements:**
1. **App Configuration Page**
   - Accessible only to users with "Developer" or "Super Admin" roles
   - List all available modules with toggle switches
   - Real-time status indicators (Active/Inactive)
   - Module metadata display (name, description, version, dependencies)

2. **Module Toggle Functionality**
   - One-click enable/disable for each module
   - Immediate effect without application restart
   - Confirmation dialogs for critical modules
   - Bulk operations for multiple modules

3. **Module Dependencies**
   - Automatic dependency resolution
   - Warning system for dependent modules
   - Cascade activation/deactivation options
   - Dependency visualization

**Acceptance Criteria:**
- ✅ Configuration page loads within 2 seconds
- ✅ Module toggles update immediately in sidebar
- ✅ Changes persist across user sessions
- ✅ Dependency conflicts prevented automatically

### **FR-002: Dynamic Navigation System**

**Description:** Real-time sidebar navigation based on active modules

**Requirements:**
1. **Dynamic Sidebar Generation**
   - Navigation items generated from active modules only
   - Real-time updates when modules are toggled
   - Maintain navigation hierarchy and grouping
   - Preserve user experience and visual consistency

2. **Route Protection**
   - Automatic route guarding for inactive modules
   - Graceful handling of direct URL access to disabled modules
   - Redirect to appropriate fallback pages
   - Clear error messages for unauthorized access

3. **Module-Specific Navigation**
   - Each module defines its own navigation structure
   - Support for nested navigation items
   - Icon and badge support for modules
   - Conditional navigation based on user roles

**Acceptance Criteria:**
- ✅ Sidebar updates within 1 second of module toggle
- ✅ Disabled module routes return 403 Forbidden
- ✅ Navigation maintains visual consistency
- ✅ No broken links or navigation errors

### **FR-003: Role-Based Access Control**

**Description:** Secure access control for module configuration

**Requirements:**
1. **Administrative Role Requirements**
   - Only "Developer" and "Super Admin" roles can access configuration
   - New "Developer" role creation if not exists
   - Role-based UI element visibility
   - Audit trail for all configuration changes

2. **Permission System Integration**
   - New permissions: "modules.configure", "modules.view"
   - Integration with existing HSEPermissions system
   - Role-permission mapping for module management
   - Granular permissions for different module operations

3. **Security Measures**
   - JWT token validation for all module operations
   - Rate limiting for configuration changes
   - Session validation and timeout handling
   - Secure API endpoints with proper authorization

**Acceptance Criteria:**
- ✅ Non-authorized users cannot access configuration
- ✅ All configuration changes are logged
- ✅ Role permissions properly enforced
- ✅ Security vulnerabilities prevented

---

## 🔧 **TECHNICAL REQUIREMENTS**

### **TR-001: Database Schema Design**

**New Entities Required:**

```sql
-- Module Definition Table
CREATE TABLE Modules (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    DisplayName VARCHAR(200) NOT NULL,
    Description TEXT,
    Version VARCHAR(20) NOT NULL,
    IsSystemModule BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    SortOrder INTEGER DEFAULT 0,
    IconClass VARCHAR(100),
    RoutePrefix VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedBy VARCHAR(100)
);

-- Module Dependencies Table
CREATE TABLE ModuleDependencies (
    Id SERIAL PRIMARY KEY,
    ModuleId INTEGER REFERENCES Modules(Id),
    DependsOnModuleId INTEGER REFERENCES Modules(Id),
    IsRequired BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module Configuration Table
CREATE TABLE ModuleConfigurations (
    Id SERIAL PRIMARY KEY,
    ModuleId INTEGER REFERENCES Modules(Id),
    IsEnabled BOOLEAN DEFAULT TRUE,
    ConfigurationData JSONB,
    EnabledAt TIMESTAMP,
    DisabledAt TIMESTAMP,
    EnabledBy VARCHAR(100),
    DisabledBy VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module Navigation Items Table
CREATE TABLE ModuleNavigationItems (
    Id SERIAL PRIMARY KEY,
    ModuleId INTEGER REFERENCES Modules(Id),
    ParentId INTEGER REFERENCES ModuleNavigationItems(Id),
    Name VARCHAR(200) NOT NULL,
    Route VARCHAR(500),
    IconClass VARCHAR(100),
    SortOrder INTEGER DEFAULT 0,
    IsGroup BOOLEAN DEFAULT FALSE,
    RequiredPermission VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Seed Data:**
```sql
-- Insert existing modules
INSERT INTO Modules (Name, DisplayName, Description, IsSystemModule, IsActive, SortOrder, RoutePrefix) VALUES
('dashboard', 'Dashboard', 'Central HSE metrics and overview', TRUE, TRUE, 1, '/dashboard'),
('incidents', 'Incident Management', 'Report, track, and investigate incidents', TRUE, TRUE, 2, '/incidents'),
('risk-management', 'Risk Management', 'Risk assessments and control measures', TRUE, TRUE, 3, '/risks'),
('permits', 'Permit to Work', 'Work permit management system', TRUE, TRUE, 4, '/permits'),
('training', 'Training', 'Training records and certifications', TRUE, TRUE, 5, '/training'),
('documents', 'Document Management', 'HSE document library', TRUE, TRUE, 6, '/documents'),
('compliance', 'Compliance', 'Regulatory compliance tracking', TRUE, TRUE, 7, '/compliance'),
('analytics', 'Analytics', 'Reports and data visualization', TRUE, TRUE, 8, '/analytics');
```

### **TR-002: Backend Implementation**

**New Domain Entities:**
```csharp
// DigitalHSE.Domain/Configuration/Module.cs
public class Module : TrackableEntity
{
    public string Name { get; private set; }
    public string DisplayName { get; private set; }
    public string Description { get; private set; }
    public string Version { get; private set; }
    public bool IsSystemModule { get; private set; }
    public bool IsActive { get; private set; }
    public int SortOrder { get; private set; }
    public string IconClass { get; private set; }
    public string RoutePrefix { get; private set; }
    
    // Navigation properties
    public virtual ICollection<ModuleDependency> Dependencies { get; set; }
    public virtual ICollection<ModuleConfiguration> Configurations { get; set; }
    public virtual ICollection<ModuleNavigationItem> NavigationItems { get; set; }
}
```

**CQRS Commands & Queries:**
```csharp
// Commands
public record ToggleModuleCommand(int ModuleId, bool IsEnabled) : ICommand<Result>;
public record UpdateModuleConfigurationCommand(int ModuleId, object ConfigurationData) : ICommand<Result>;
public record BulkToggleModulesCommand(Dictionary<int, bool> ModuleStates) : ICommand<Result>;

// Queries  
public record GetActiveModulesQuery() : IQuery<Result<List<ModuleDto>>>;
public record GetModuleConfigurationQuery(int ModuleId) : IQuery<Result<ModuleConfigurationDto>>;
public record GetNavigationItemsQuery() : IQuery<Result<List<NavigationItemDto>>>;
```

**API Controllers:**
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Developer,Super Admin")]
public class ModuleConfigurationController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetModules();
    
    [HttpPost("{moduleId}/toggle")]
    public async Task<IActionResult> ToggleModule(int moduleId, [FromBody] ToggleModuleRequest request);
    
    [HttpGet("navigation")]
    [AllowAnonymous] // For generating navigation
    public async Task<IActionResult> GetNavigationItems();
}
```

### **TR-003: Frontend Implementation**

**Module Configuration Component:**
```typescript
// src/views/configuration/ModuleConfiguration.tsx
interface ModuleConfigurationProps {
  modules: Module[];
  onToggleModule: (moduleId: number, enabled: boolean) => Promise<void>;
  onBulkToggle: (moduleStates: Record<number, boolean>) => Promise<void>;
}

const ModuleConfiguration: React.FC<ModuleConfigurationProps> = ({
  modules,
  onToggleModule,
  onBulkToggle
}) => {
  // Implementation with CoreUI components
  // Toggle switches, dependency warnings, bulk operations
};
```

**Dynamic Navigation Service:**
```typescript
// src/services/navigationService.ts
class NavigationService {
  private static instance: NavigationService;
  private navigationItems: NavigationItem[] = [];
  private subscribers: ((items: NavigationItem[]) => void)[] = [];

  async loadNavigationItems(): Promise<NavigationItem[]> {
    const response = await api.get('/api/moduleconfiguration/navigation');
    this.navigationItems = response.data;
    this.notifySubscribers();
    return this.navigationItems;
  }

  subscribe(callback: (items: NavigationItem[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.navigationItems));
  }
}
```

**Enhanced Sidebar Component:**
```typescript
// src/components/sidebar/AppSidebar.tsx (Enhanced)
const AppSidebar: React.FC = () => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  
  useEffect(() => {
    const unsubscribe = NavigationService.getInstance().subscribe(setNavigationItems);
    NavigationService.getInstance().loadNavigationItems();
    return unsubscribe;
  }, []);

  return (
    <CSidebar>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigationItems} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};
```

---

## 🔒 **SECURITY REQUIREMENTS**

### **SR-001: Authentication & Authorization**
- JWT token validation for all module configuration endpoints
- Role-based access control with "Developer" and "Super Admin" roles
- Session timeout and token refresh handling
- Audit logging for all configuration changes

### **SR-002: Data Protection**
- Encrypted storage of sensitive configuration data
- Input validation and sanitization
- SQL injection prevention
- XSS protection for frontend components

### **SR-003: API Security**
- Rate limiting for configuration endpoints (10 requests/minute)
- CORS policy updates for module management
- Request/response logging for security monitoring
- Secure error handling without information disclosure

---

## 📊 **PERFORMANCE REQUIREMENTS**

### **PR-001: Response Times**
- Module configuration page load: < 2 seconds
- Module toggle response: < 500ms
- Navigation update: < 1 second
- Bulk operations: < 5 seconds for up to 20 modules

### **PR-002: Scalability**
- Support for up to 50 modules without performance degradation
- Efficient database queries with proper indexing
- Caching strategy for frequently accessed module data
- Optimized frontend rendering for large navigation trees

### **PR-003: Reliability**
- 99.9% uptime for module management functionality
- Graceful degradation when module services are unavailable
- Automatic recovery from temporary failures
- Data consistency across all module operations

---

## 🧪 **TESTING STRATEGY**

### **Unit Testing**
- **Backend**: 90% code coverage for all module management services
- **Frontend**: Component testing with React Testing Library
- **Database**: Entity Framework integration tests
- **API**: Controller endpoint testing with WebApplicationFactory

### **Integration Testing**
- End-to-end module toggle workflows
- Navigation update verification
- Role-based access control validation
- Database transaction integrity

### **Performance Testing**
- Load testing with 100 concurrent users
- Module toggle performance under load
- Navigation rendering performance
- Database query optimization validation

### **Security Testing**
- Penetration testing for module configuration endpoints
- Role escalation prevention testing
- Input validation and sanitization verification
- Authentication bypass attempt testing

---

## 📈 **IMPLEMENTATION PHASES**

### **Phase 1: Foundation (Week 1-2)**
**Priority:** CRITICAL
**Effort:** 80 hours

**Tasks:**
1. Database schema creation and migration
2. Domain entity implementation
3. Basic CQRS commands and queries
4. Core API endpoints
5. Role and permission updates

**Deliverables:**
- ✅ Database tables created and seeded
- ✅ Basic module toggle functionality
- ✅ API endpoints operational
- ✅ Unit tests for core functionality

### **Phase 2: Frontend Implementation (Week 3-4)**
**Priority:** HIGH  
**Effort:** 100 hours

**Tasks:**
1. Module configuration UI component
2. Dynamic navigation service
3. Enhanced sidebar component
4. Route protection implementation
5. Error handling and user feedback

**Deliverables:**
- ✅ App Configuration page functional
- ✅ Dynamic sidebar navigation
- ✅ Role-based access control
- ✅ Comprehensive error handling

### **Phase 3: Advanced Features (Week 5-6)**
**Priority:** MEDIUM
**Effort:** 60 hours

**Tasks:**
1. Module dependency management
2. Bulk operations implementation
3. Configuration data management
4. Audit trail and logging
5. Performance optimization

**Deliverables:**
- ✅ Dependency resolution system
- ✅ Bulk toggle operations
- ✅ Advanced configuration options
- ✅ Complete audit trail

### **Phase 4: Testing & Deployment (Week 7-8)**
**Priority:** HIGH
**Effort:** 40 hours

**Tasks:**
1. Comprehensive testing suite
2. Performance optimization
3. Security hardening
4. Documentation completion
5. Production deployment

**Deliverables:**
- ✅ Full test coverage
- ✅ Performance benchmarks met
- ✅ Security audit passed
- ✅ Production deployment ready

---

## 🎯 **SUCCESS METRICS**

### **Technical Metrics**
- **Module Toggle Response Time**: < 500ms (Target: 200ms)
- **Navigation Update Speed**: < 1 second (Target: 300ms)
- **Database Query Performance**: < 100ms (Target: 50ms)
- **Frontend Bundle Size Impact**: < 50KB additional (Target: 30KB)

### **Business Metrics**
- **Administrative Efficiency**: 80% reduction in module management time
- **User Experience**: 95% user satisfaction with navigation clarity
- **System Reliability**: 99.9% uptime for module functionality
- **Scalability**: Support for 50+ modules without degradation

### **Quality Metrics**
- **Code Coverage**: 90% minimum (Target: 95%)
- **Security Score**: A+ rating from security audit
- **Performance Score**: 95+ Lighthouse score
- **Accessibility**: WCAG 2.1 AA compliance

---

## ⚠️ **RISK ASSESSMENT**

### **High Risk Items**
1. **Database Migration Complexity**
   - **Risk**: Data loss during schema updates
   - **Mitigation**: Comprehensive backup strategy, staged rollout
   - **Contingency**: Rollback procedures and data recovery plans

2. **Frontend State Management**
   - **Risk**: Navigation state inconsistencies
   - **Mitigation**: Centralized state management, comprehensive testing
   - **Contingency**: Fallback to static navigation if dynamic fails

3. **Performance Impact**
   - **Risk**: Slower application performance
   - **Mitigation**: Caching strategies, optimized queries
   - **Contingency**: Performance monitoring and optimization

### **Medium Risk Items**
1. **Role Permission Conflicts**
   - **Risk**: Unauthorized access to configuration
   - **Mitigation**: Thorough role testing, security audit
   - **Contingency**: Emergency role restriction capabilities

2. **Module Dependency Complexity**
   - **Risk**: Circular dependencies or conflicts
   - **Mitigation**: Dependency validation, clear documentation
   - **Contingency**: Manual dependency resolution tools

### **Low Risk Items**
1. **UI/UX Consistency**
   - **Risk**: Inconsistent user experience
   - **Mitigation**: Design system adherence, user testing
   - **Contingency**: UI refinement in subsequent iterations

---

## 📋 **ACCEPTANCE CRITERIA**

### **Primary Acceptance Criteria**
1. ✅ **Module Toggle System**: Users with "Developer" or "Super Admin" roles can enable/disable modules through App Configuration interface
2. ✅ **Dynamic Navigation**: Sidebar navigation updates immediately when modules are toggled ON/OFF
3. ✅ **Route Protection**: Disabled modules are inaccessible to regular users with appropriate error handling
4. ✅ **Persistent State**: Module states persist across user sessions and application restarts
5. ✅ **Role-Based Access**: Only authorized roles can access the App Configuration page
6. ✅ **Performance**: All operations complete within specified time limits
7. ✅ **Scalability**: System supports addition of new modules without code changes

### **Secondary Acceptance Criteria**
1. ✅ **Dependency Management**: Module dependencies are properly resolved and enforced
2. ✅ **Audit Trail**: All configuration changes are logged with user and timestamp
3. ✅ **Error Handling**: Graceful error handling with user-friendly messages
4. ✅ **Mobile Responsiveness**: Configuration interface works on mobile devices
5. ✅ **Documentation**: Comprehensive documentation for administrators and developers

---

## 🚀 **DEPLOYMENT STRATEGY**

### **Development Environment**
- Feature branch development with pull request reviews
- Automated testing pipeline with quality gates
- Database migration testing in isolated environment
- Performance testing with realistic data volumes

### **Staging Environment**
- Full system integration testing
- User acceptance testing with stakeholders
- Security penetration testing
- Performance benchmarking under load

### **Production Deployment**
- Blue-green deployment strategy for zero downtime
- Database migration with rollback capability
- Feature flag controlled rollout
- Real-time monitoring and alerting

### **Rollback Plan**
- Automated rollback triggers based on error rates
- Database rollback procedures with data preservation
- Frontend fallback to static navigation
- Emergency contact procedures for critical issues

---

## 📚 **DOCUMENTATION REQUIREMENTS**

### **Technical Documentation**
1. **API Documentation**: Comprehensive Swagger/OpenAPI specifications
2. **Database Schema**: Entity relationship diagrams and migration guides
3. **Architecture Documentation**: System design and component interactions
4. **Development Guide**: Setup instructions and coding standards

### **User Documentation**
1. **Administrator Guide**: Module configuration procedures
2. **User Manual**: Navigation and feature usage
3. **Troubleshooting Guide**: Common issues and solutions
4. **FAQ**: Frequently asked questions and answers

### **Operational Documentation**
1. **Deployment Guide**: Step-by-step deployment procedures
2. **Monitoring Guide**: System health and performance monitoring
3. **Backup Procedures**: Data backup and recovery processes
4. **Security Procedures**: Security incident response plans

---

## 🔄 **MAINTENANCE & SUPPORT**

### **Ongoing Maintenance**
- Regular security updates and patches
- Performance monitoring and optimization
- Database maintenance and cleanup
- User feedback collection and analysis

### **Support Procedures**
- 24/7 monitoring for critical issues
- Escalation procedures for system failures
- User support ticketing system
- Regular system health reports

### **Future Enhancements**
- Advanced module analytics and usage tracking
- Module marketplace for third-party extensions
- Advanced dependency management features
- Mobile application module management

---

**Document Prepared By:** Tech Lead & Solution Architect  
**Review Date:** February 15, 2025  
**Approval Required:** Project Manager, Development Team Lead  
**Implementation Start:** February 1, 2025  
**Target Completion:** March 31, 2025
