import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilSave } from '@coreui/icons'

interface SimpleIncidentForm {
  incidentDateTime: string
  title: string
  description: string
  type: string
  severity: string
  location: string
  reportedBy: string
  reporterEmail: string
}

const IncidentFormSimple: React.FC = () => {
  const [formData, setFormData] = useState<SimpleIncidentForm>({
    incidentDateTime: '',
    title: '',
    description: '',
    type: '',
    severity: '',
    location: '',
    reportedBy: '',
    reporterEmail: ''
  })
  
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: string[] = []
    if (!formData.title) newErrors.push('Title is required')
    if (!formData.description) newErrors.push('Description is required')
    if (!formData.type) newErrors.push('Incident type is required')
    if (!formData.severity) newErrors.push('Severity is required')
    
    setErrors(newErrors)
    
    if (newErrors.length === 0) {
      console.log('Form submitted:', formData)
      // Here you would call your API
    }
  }

  const handleChange = (field: keyof SimpleIncidentForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>
              <CIcon icon={cilWarning} className="me-2" />
              Report New Incident - BSJ Safety System
            </strong>
          </CCardHeader>
          <CCardBody>
            {errors.length > 0 && (
              <CAlert color="danger">
                <strong>Please fix the following errors:</strong>
                <ul className="mb-0 mt-2">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CAlert>
            )}
            
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="incidentDateTime">Incident Date & Time *</CFormLabel>
                  <CFormInput 
                    type="datetime-local" 
                    id="incidentDateTime"
                    value={formData.incidentDateTime}
                    onChange={(e) => handleChange('incidentDateTime', e.target.value)}
                    required 
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="severity">Severity Level *</CFormLabel>
                  <CFormSelect 
                    id="severity"
                    value={formData.severity}
                    onChange={(e) => handleChange('severity', e.target.value)}
                    required
                  >
                    <option value="">Select severity...</option>
                    <option value="Minor">Minor - No injury, minimal impact</option>
                    <option value="Low">Low - First aid only</option>
                    <option value="Moderate">Moderate - Medical treatment required</option>
                    <option value="Major">Major - Serious injury, hospitalization</option>
                    <option value="Critical">Critical - Life-threatening</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="title">Incident Title *</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Brief description (e.g., Student injured in playground)"
                    maxLength={200}
                    required 
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="type">Incident Type *</CFormLabel>
                  <CFormSelect 
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  >
                    <option value="">Select incident type...</option>
                    <optgroup label="Student Incidents">
                      <option value="StudentInjury">Student Injury</option>
                      <option value="PlaygroundAccident">Playground Accident</option>
                      <option value="SportsInjury">Sports Injury</option>
                      <option value="BehavioralIncident">Behavioral Incident</option>
                      <option value="BullyingIncident">Bullying Incident</option>
                    </optgroup>
                    <optgroup label="Staff Incidents">
                      <option value="StaffInjury">Staff Injury</option>
                      <option value="TeacherInjury">Teacher Injury</option>
                    </optgroup>
                    <optgroup label="Facility Incidents">
                      <option value="LaboratoryAccident">Laboratory Accident</option>
                      <option value="Fire">Fire</option>
                      <option value="PropertyDamage">Property Damage</option>
                    </optgroup>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="location">Location *</CFormLabel>
                  <CFormSelect 
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                  >
                    <option value="">Select location...</option>
                    <option value="Main Building - Elementary Wing">Main Building - Elementary Wing</option>
                    <option value="Main Building - Middle School Wing">Main Building - Middle School Wing</option>
                    <option value="Main Building - High School Wing">Main Building - High School Wing</option>
                    <option value="Science Laboratory Building">Science Laboratory Building</option>
                    <option value="Sports Complex - Indoor">Sports Complex - Indoor</option>
                    <option value="Sports Complex - Outdoor Fields">Sports Complex - Outdoor Fields</option>
                    <option value="Playground - Elementary">Playground - Elementary</option>
                    <option value="Cafeteria & Dining Hall">Cafeteria & Dining Hall</option>
                    <option value="Other">Other</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="description">Detailed Description *</CFormLabel>
                  <CFormTextarea 
                    id="description" 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide a detailed description of what happened..."
                    maxLength={2000}
                    required 
                  />
                  <div className="form-text">{formData.description.length}/2000 characters</div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="reportedBy">Reported By *</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="reportedBy"
                    value={formData.reportedBy}
                    onChange={(e) => handleChange('reportedBy', e.target.value)}
                    placeholder="Your full name"
                    required 
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="reporterEmail">Email Address *</CFormLabel>
                  <CFormInput 
                    type="email" 
                    id="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={(e) => handleChange('reporterEmail', e.target.value)}
                    placeholder="your.email@bsj.sch.id"
                    required 
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary">Cancel</CButton>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" />
                  Submit Report
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default IncidentFormSimple