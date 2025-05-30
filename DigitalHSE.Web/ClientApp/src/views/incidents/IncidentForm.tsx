import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CRow,
  CButton,
  CAlert,
  CBadge,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CSpinner,
  CToast,
  CToastBody,
  CToaster,
  CProgress,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilWarning,
  cilUser,
  cilChild,
  cilLocationPin,
  cilClock,
  cilCamera,
  cilPaperclip,
  cilShieldAlt,
  cilPhone,
  cilEnvelopeClosed,
  cilMedicalCross,
} from '@coreui/icons'

interface IncidentFormData {
  incidentDateTime: string
  title: string
  description: string
  type: string
  severity: string
  location: string
  department: string
  specificLocation: string
  reportedBy: string
  reporterEmail: string
  reporterPhone: string
  witnesses: string
  immediateActions: string
  
  // Student Information
  isStudentIncident: boolean
  studentId: string
  studentName: string
  studentClass: string
  parentContact: string
  ageGroup: string
  teacherInCharge: string
  
  // Medical Information
  requiresMedicalAttention: boolean
  medicalFacility: string
  
  // Regulatory Requirements
  requiresBPJSReporting: boolean
  requiresMinistryReporting: boolean
  
  // Attachments
  photos: File[]
  attachments: File[]
}

const IncidentForm: React.FC = () => {
  const { t } = useTranslation(['hse', 'common'])
  const [formData, setFormData] = useState<IncidentFormData>({
    incidentDateTime: '',
    title: '',
    description: '',
    type: '',
    severity: '',
    location: '',
    department: '',
    specificLocation: '',
    reportedBy: '',
    reporterEmail: '',
    reporterPhone: '',
    witnesses: '',
    immediateActions: '',
    isStudentIncident: false,
    studentId: '',
    studentName: '',
    studentClass: '',
    parentContact: '',
    ageGroup: '',
    teacherInCharge: '',
    requiresMedicalAttention: false,
    medicalFacility: '',
    requiresBPJSReporting: false,
    requiresMinistryReporting: false,
    photos: [],
    attachments: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [toast, addToast] = useState<any>(0)
  const [formProgress, setFormProgress] = useState(0)

  // BSJ School-specific incident types
  const incidentTypes = [
    { value: 'StudentInjury', label: t('hse:incident.types.studentInjury'), category: 'student' },
    { value: 'StaffInjury', label: t('hse:incident.types.staffInjury'), category: 'staff' },
    { value: 'TeacherInjury', label: t('hse:incident.types.teacherInjury'), category: 'staff' },
    { value: 'PlaygroundAccident', label: t('hse:incident.types.playgroundAccident'), category: 'student' },
    { value: 'SportsInjury', label: t('hse:incident.types.sportsInjury'), category: 'student' },
    { value: 'LaboratoryAccident', label: t('hse:incident.types.laboratoryAccident'), category: 'academic' },
    { value: 'FieldTripIncident', label: t('hse:incident.types.fieldTripIncident'), category: 'student' },
    { value: 'BehavioralIncident', label: t('hse:incident.types.behavioralIncident'), category: 'behavior' },
    { value: 'BullyingIncident', label: t('hse:incident.types.bullyingIncident'), category: 'behavior' },
    { value: 'SecurityIncident', label: t('hse:incident.types.securityIncident'), category: 'security' },
    { value: 'FoodSafetyIncident', label: t('hse:incident.types.foodSafetyIncident'), category: 'health' },
    { value: 'TransportationIncident', label: t('hse:incident.types.transportationIncident'), category: 'transport' },
    { value: 'Fire', label: t('hse:incident.types.fire'), category: 'emergency' },
    { value: 'PropertyDamage', label: t('hse:incident.types.propertyDamage'), category: 'property' },
    { value: 'NearMiss', label: t('hse:incident.types.nearMiss'), category: 'safety' },
    { value: 'Other', label: t('hse:incident.types.other'), category: 'other' },
  ]

  const severityLevels = [
    { value: 'Minor', label: t('hse:incident.severity.minor'), color: 'light', description: 'No injury, minimal impact' },
    { value: 'Low', label: t('hse:incident.severity.low'), color: 'info', description: 'First aid only, minor property damage' },
    { value: 'Moderate', label: t('hse:incident.severity.moderate'), color: 'warning', description: 'Medical treatment required, moderate impact' },
    { value: 'Major', label: t('hse:incident.severity.major'), color: 'danger', description: 'Serious injury, hospitalization required' },
    { value: 'Critical', label: t('hse:incident.severity.critical'), color: 'danger', description: 'Life-threatening, permanent disability' },
  ]

  const locations = [
    'Main Building - Elementary Wing',
    'Main Building - Middle School Wing', 
    'Main Building - High School Wing',
    'Science Laboratory Building',
    'Sports Complex - Indoor',
    'Sports Complex - Outdoor Fields',
    'Swimming Pool Area',
    'Library Building',
    'Cafeteria & Dining Hall',
    'Arts & Music Building',
    'Playground - Elementary',
    'Playground - Preschool',
    'Parking Area - Staff',
    'Parking Area - Visitor',
    'Administration Building',
    'Maintenance Workshop',
    'Bus Loading Zone',
    'Other'
  ]

  // Auto-detect student incident types
  useEffect(() => {
    const studentIncidentTypes = ['StudentInjury', 'PlaygroundAccident', 'SportsInjury', 'BehavioralIncident', 'BullyingIncident', 'FieldTripIncident']
    setFormData(prev => ({
      ...prev,
      isStudentIncident: studentIncidentTypes.includes(prev.type)
    }))
  }, [formData.type])

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = [
      'incidentDateTime', 'title', 'description', 'type', 'severity', 'location', 
      'department', 'reportedBy', 'reporterEmail'
    ]
    
    const studentFields = formData.isStudentIncident ? 
      ['studentId', 'studentName', 'studentClass', 'parentContact', 'ageGroup'] : []
    
    const medicalFields = formData.requiresMedicalAttention ? ['medicalFacility'] : []
    
    const allRequired = [...requiredFields, ...studentFields, ...medicalFields]
    const completed = allRequired.filter(field => formData[field as keyof IncidentFormData] as string).length
    
    setFormProgress((completed / allRequired.length) * 100)
  }, [formData])

  const handleInputChange = (field: keyof IncidentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleFileUpload = (field: 'photos' | 'attachments', files: FileList) => {
    const maxFiles = field === 'photos' ? 10 : 5
    const maxSize = 10 * 1024 * 1024 // 10MB per file
    
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize) {
        addToast(<CToast><CToastBody>File {file.name} is too large. Maximum size is 10MB.</CToastBody></CToast>)
        return false
      }
      return true
    }).slice(0, maxFiles)
    
    setFormData(prev => ({ ...prev, [field]: validFiles }))
  }

  const validateForm = (): boolean => {
    const errors: string[] = []
    
    if (!formData.incidentDateTime) errors.push('Incident date and time is required')
    if (!formData.title) errors.push('Incident title is required')
    if (!formData.description) errors.push('Incident description is required')
    if (!formData.type) errors.push('Incident type is required')
    if (!formData.severity) errors.push('Severity level is required')
    if (!formData.location) errors.push('Location is required')
    if (!formData.department) errors.push('Department is required')
    if (!formData.reportedBy) errors.push('Reporter name is required')
    if (!formData.reporterEmail) errors.push('Reporter email is required')
    
    // Student incident validations
    if (formData.isStudentIncident) {
      if (!formData.studentId) errors.push('Student ID is required for student incidents')
      if (!formData.studentName) errors.push('Student name is required for student incidents')
      if (!formData.studentClass) errors.push('Student class is required for student incidents')
      if (!formData.parentContact) errors.push('Parent contact is required for student incidents')
      if (!formData.ageGroup) errors.push('Age group is required for student incidents')
    }
    
    // Medical attention validations
    if (formData.requiresMedicalAttention && !formData.medicalFacility) {
      errors.push('Medical facility is required when medical attention is needed')
    }
    
    // Severity-specific validations
    if (['Moderate', 'Major', 'Critical'].includes(formData.severity) && !formData.immediateActions) {
      errors.push('Immediate actions are required for moderate or higher severity incidents')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Here you would call your API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      addToast(
        <CToast color="success">
          <CToastBody>
            <div className="d-flex align-items-center">
              <CIcon icon={cilShieldAlt} className="me-2" />
              Incident reported successfully. Incident number: INC-{Date.now()}
            </div>
          </CToastBody>
        </CToast>
      )
      
      // Reset form or redirect
      setFormData({
        incidentDateTime: '',
        title: '',
        description: '',
        type: '',
        severity: '',
        location: '',
        department: '',
        specificLocation: '',
        reportedBy: '',
        reporterEmail: '',
        reporterPhone: '',
        witnesses: '',
        immediateActions: '',
        isStudentIncident: false,
        studentId: '',
        studentName: '',
        studentClass: '',
        parentContact: '',
        ageGroup: '',
        teacherInCharge: '',
        requiresMedicalAttention: false,
        medicalFacility: '',
        requiresBPJSReporting: false,
        requiresMinistryReporting: false,
        photos: [],
        attachments: []
      })
      
    } catch (error) {
      addToast(
        <CToast color="danger">
          <CToastBody>Failed to submit incident report. Please try again.</CToastBody>
        </CToast>
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong><CIcon icon={cilWarning} className="me-2" />Report New Incident</strong>
              <div className="text-medium-emphasis small mt-1">
                BSJ Incident Management System - Complete this form as soon as possible
              </div>
            </div>
            <div className="text-end">
              <div className="small text-medium-emphasis">Form Progress</div>
              <CProgress value={formProgress} className="mb-1" style={{ width: '120px' }} />
              <small>{Math.round(formProgress)}% complete</small>
            </div>
          </CCardHeader>
          <CCardBody>
            {validationErrors.length > 0 && (
              <CAlert color="danger" className="mb-4">
                <CIcon icon={cilWarning} className="me-2" />
                <strong>Please fix the following errors:</strong>
                <ul className="mb-0 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CAlert>
            )}
            
            <CForm onSubmit={handleSubmit}>
              <CAccordion flush>
                {/* Basic Information */}
                <CAccordionItem itemKey="basic">
                  <CAccordionHeader>
                    <CIcon icon={cilClock} className="me-2" />
                    Basic Incident Information
                    <CBadge color="primary" className="ms-2">Required</CBadge>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="incidentDateTime">
                          <CIcon icon={cilClock} className="me-1" />
                          Incident Date & Time *
                        </CFormLabel>
                        <CFormInput 
                          type="datetime-local" 
                          id="incidentDateTime"
                          value={formData.incidentDateTime}
                          onChange={(e) => handleInputChange('incidentDateTime', e.target.value)}
                          required 
                        />
                        <div className="form-text">When did the incident occur?</div>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="severity">
                          <CIcon icon={cilWarning} className="me-1" />
                          Severity Level *
                        </CFormLabel>
                        <CFormSelect 
                          id="severity"
                          value={formData.severity}
                          onChange={(e) => handleInputChange('severity', e.target.value)}
                          required
                        >
                          <option value="">Select severity...</option>
                          {severityLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} - {level.description}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel htmlFor="title">
                          Incident Title *
                        </CFormLabel>
                        <CFormInput 
                          type="text" 
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Brief description of the incident (e.g., Student injured in playground)"
                          maxLength={200}
                          required 
                        />
                        <div className="form-text">{formData.title.length}/200 characters</div>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="type">
                          Incident Type *
                        </CFormLabel>
                        <CFormSelect 
                          id="type"
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          required
                        >
                          <option value="">Select incident type...</option>
                          {incidentTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="location">
                          <CIcon icon={cilLocationPin} className="me-1" />
                          Location *
                        </CFormLabel>
                        <CFormSelect 
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          required
                        >
                          <option value="">Select location...</option>
                          {locations.map(location => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="department">
                          Department *
                        </CFormLabel>
                        <CFormSelect 
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          required
                        >
                          <option value="">Select department...</option>
                          <option value="Elementary School">Elementary School</option>
                          <option value="Middle School">Middle School</option>
                          <option value="High School">High School</option>
                          <option value="Administration">Administration</option>
                          <option value="Facilities">Facilities</option>
                          <option value="Security">Security</option>
                          <option value="Food Services">Food Services</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Medical">Medical</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="specificLocation">
                          Specific Location Details
                        </CFormLabel>
                        <CFormInput 
                          type="text" 
                          id="specificLocation"
                          value={formData.specificLocation}
                          onChange={(e) => handleInputChange('specificLocation', e.target.value)}
                          placeholder="Room number, specific area, etc."
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel htmlFor="description">
                          Detailed Description *
                        </CFormLabel>
                        <CFormTextarea 
                          id="description" 
                          rows={4}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Provide a detailed description of what happened, including sequence of events..."
                          maxLength={2000}
                          required 
                        />
                        <div className="form-text">{formData.description.length}/2000 characters</div>
                      </CCol>
                    </CRow>
                  </CAccordionBody>
                </CAccordionItem>

                {/* Student Information */}
                {formData.isStudentIncident && (
                  <CAccordionItem itemKey="student">
                    <CAccordionHeader>
                      <CIcon icon={cilChild} className="me-2" />
                      Student Information
                      <CBadge color="warning" className="ms-2">Required for Student Incidents</CBadge>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <CRow className="mb-3">
                        <CCol md={4}>
                          <CFormLabel htmlFor="studentId">
                            Student ID *
                          </CFormLabel>
                          <CFormInput 
                            type="text" 
                            id="studentId"
                            value={formData.studentId}
                            onChange={(e) => handleInputChange('studentId', e.target.value)}
                            placeholder="Student ID number"
                            required={formData.isStudentIncident}
                          />
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel htmlFor="studentName">
                            Student Name *
                          </CFormLabel>
                          <CFormInput 
                            type="text" 
                            id="studentName"
                            value={formData.studentName}
                            onChange={(e) => handleInputChange('studentName', e.target.value)}
                            placeholder="Full name"
                            required={formData.isStudentIncident}
                          />
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel htmlFor="studentClass">
                            Class *
                          </CFormLabel>
                          <CFormInput 
                            type="text" 
                            id="studentClass"
                            value={formData.studentClass}
                            onChange={(e) => handleInputChange('studentClass', e.target.value)}
                            placeholder="Grade and section (e.g., 5A, 10IPA1)"
                            required={formData.isStudentIncident}
                          />
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={4}>
                          <CFormLabel htmlFor="ageGroup">
                            Age Group *
                          </CFormLabel>
                          <CFormSelect 
                            id="ageGroup"
                            value={formData.ageGroup}
                            onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                            required={formData.isStudentIncident}
                          >
                            <option value="">Select age group...</option>
                            <option value="Primary">Primary (Ages 6-12)</option>
                            <option value="Secondary">Secondary (Ages 13-18)</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel htmlFor="parentContact">
                            <CIcon icon={cilPhone} className="me-1" />
                            Parent Contact *
                          </CFormLabel>
                          <CFormInput 
                            type="text" 
                            id="parentContact"
                            value={formData.parentContact}
                            onChange={(e) => handleInputChange('parentContact', e.target.value)}
                            placeholder="Phone number or email"
                            required={formData.isStudentIncident}
                          />
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel htmlFor="teacherInCharge">
                            Teacher in Charge
                          </CFormLabel>
                          <CFormInput 
                            type="text" 
                            id="teacherInCharge"
                            value={formData.teacherInCharge}
                            onChange={(e) => handleInputChange('teacherInCharge', e.target.value)}
                            placeholder="Supervising teacher name"
                          />
                        </CCol>
                      </CRow>
                    </CAccordionBody>
                  </CAccordionItem>
                )}

                {/* Medical Information */}
                <CAccordionItem itemKey="medical">
                  <CAccordionHeader>
                    <CIcon icon={cilMedicalCross} className="me-2" />
                    Medical Information
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormCheck 
                          id="requiresMedicalAttention"
                          checked={formData.requiresMedicalAttention}
                          onChange={(e) => handleInputChange('requiresMedicalAttention', e.target.checked)}
                          label="Medical attention required"
                        />
                      </CCol>
                    </CRow>

                    {formData.requiresMedicalAttention && (
                      <CRow className="mb-3">
                        <CCol md={12}>
                          <CFormLabel htmlFor="medicalFacility">
                            Medical Facility *
                          </CFormLabel>
                          <CFormSelect 
                            id="medicalFacility"
                            value={formData.medicalFacility}
                            onChange={(e) => handleInputChange('medicalFacility', e.target.value)}
                            required={formData.requiresMedicalAttention}
                          >
                            <option value="">Select medical facility...</option>
                            <option value="School Clinic">School Clinic</option>
                            <option value="RS Bunda Menteng">RS Bunda Menteng</option>
                            <option value="RS Cipto Mangunkusumo">RS Cipto Mangunkusumo</option>
                            <option value="RS Pondok Indah">RS Pondok Indah</option>
                            <option value="Puskesmas Menteng">Puskesmas Menteng</option>
                            <option value="Other">Other</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    )}
                  </CAccordionBody>
                </CAccordionItem>

                {/* Reporter Information */}
                <CAccordionItem itemKey="reporter">
                  <CAccordionHeader>
                    <CIcon icon={cilUser} className="me-2" />
                    Reporter Information
                    <CBadge color="primary" className="ms-2">Required</CBadge>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CRow className="mb-3">
                      <CCol md={4}>
                        <CFormLabel htmlFor="reportedBy">
                          <CIcon icon={cilUser} className="me-1" />
                          Reported By *
                        </CFormLabel>
                        <CFormInput 
                          type="text" 
                          id="reportedBy"
                          value={formData.reportedBy}
                          onChange={(e) => handleInputChange('reportedBy', e.target.value)}
                          placeholder="Your full name"
                          required 
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="reporterEmail">
                          <CIcon icon={cilEnvelopeClosed} className="me-1" />
                          Email Address *
                        </CFormLabel>
                        <CFormInput 
                          type="email" 
                          id="reporterEmail"
                          value={formData.reporterEmail}
                          onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                          placeholder="your.email@bsj.sch.id"
                          required 
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="reporterPhone">
                          <CIcon icon={cilPhone} className="me-1" />
                          Phone Number
                        </CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>+62</CInputGroupText>
                          <CFormInput 
                            type="tel" 
                            id="reporterPhone"
                            value={formData.reporterPhone}
                            onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                            placeholder="812-3456-7890"
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="witnesses">
                          Witnesses
                        </CFormLabel>
                        <CFormInput 
                          type="text" 
                          id="witnesses"
                          value={formData.witnesses}
                          onChange={(e) => handleInputChange('witnesses', e.target.value)}
                          placeholder="Names of witnesses (comma separated)"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="immediateActions">
                          Immediate Actions Taken
                        </CFormLabel>
                        <CFormTextarea 
                          id="immediateActions" 
                          rows={3}
                          value={formData.immediateActions}
                          onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                          placeholder="Describe any immediate actions taken..."
                        />
                      </CCol>
                    </CRow>
                  </CAccordionBody>
                </CAccordionItem>

                {/* Regulatory Requirements */}
                <CAccordionItem itemKey="regulatory">
                  <CAccordionHeader>
                    <CIcon icon={cilShieldAlt} className="me-2" />
                    Indonesian Regulatory Requirements
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CAlert color="info" className="mb-3">
                      <strong>Information:</strong> Based on Indonesian regulations, certain incidents must be reported to authorities within specific timeframes.
                    </CAlert>
                    
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormCheck 
                          id="requiresBPJSReporting"
                          checked={formData.requiresBPJSReporting}
                          onChange={(e) => handleInputChange('requiresBPJSReporting', e.target.checked)}
                          label="BPJS Ketenagakerjaan reporting required"
                        />
                        <div className="form-text">Check if this incident involves work-related injury requiring BPJS reporting (PP No. 50/2012)</div>
                      </CCol>
                      <CCol md={6}>
                        <CFormCheck 
                          id="requiresMinistryReporting"
                          checked={formData.requiresMinistryReporting}
                          onChange={(e) => handleInputChange('requiresMinistryReporting', e.target.checked)}
                          label="Ministry of Education reporting required"
                        />
                        <div className="form-text">Check for serious student safety incidents (Permendikbud No. 46/2023)</div>
                      </CCol>
                    </CRow>
                  </CAccordionBody>
                </CAccordionItem>

                {/* Attachments */}
                <CAccordionItem itemKey="attachments">
                  <CAccordionHeader>
                    <CIcon icon={cilCamera} className="me-2" />
                    Photos & Attachments
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="photos">
                          <CIcon icon={cilCamera} className="me-1" />
                          Photos (Max 10 files, 10MB each)
                        </CFormLabel>
                        <CFormInput 
                          type="file" 
                          id="photos"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload('photos', e.target.files)}
                        />
                        <div className="form-text">Photos of the incident scene, injuries (if appropriate), or damage</div>
                        {formData.photos.length > 0 && (
                          <div className="mt-2">
                            <small>Selected: {formData.photos.length} photo(s)</small>
                          </div>
                        )}
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="attachments">
                          <CIcon icon={cilPaperclip} className="me-1" />
                          Documents (Max 5 files, 10MB each)
                        </CFormLabel>
                        <CFormInput 
                          type="file" 
                          id="attachments"
                          multiple
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => e.target.files && handleFileUpload('attachments', e.target.files)}
                        />
                        <div className="form-text">Medical reports, witness statements, or other relevant documents</div>
                        {formData.attachments.length > 0 && (
                          <div className="mt-2">
                            <small>Selected: {formData.attachments.length} document(s)</small>
                          </div>
                        )}
                      </CCol>
                    </CRow>
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                <div className="text-muted small">
                  All required fields (*) must be completed before submission
                </div>
                <div className="d-flex gap-2">
                  <CButton color="secondary">
                    Cancel
                  </CButton>
                  <CButton 
                    color="primary" 
                    type="submit"
                    disabled={isSubmitting || formProgress < 70}
                  >
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilShieldAlt} className="me-2" />
                        Submit Incident Report
                      </>
                    )}
                  </CButton>
                </div>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CToaster ref={toast} push={toast} placement="top-end" />
    </CRow>
  )
}

export default IncidentForm