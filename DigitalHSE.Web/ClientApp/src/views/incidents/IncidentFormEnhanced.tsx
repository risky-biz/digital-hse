import React, { useState, useEffect, useCallback } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CButtonGroup,
  CAlert,
  CProgress,
  CProgressBar,
  CSpinner,
  CFormCheck,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
  CTooltip,
  CBadge,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CListGroup,
  CListGroupItem,
  CImage,
  CCloseButton,
} from '@coreui/react';
import { 
  cilWarning, 
  cilUser, 
  cilLocationPin, 
  cilCamera,
  cilPhone,
  cilMedicalCross,
  cilCheckCircle,
  cilArrowLeft,
  cilArrowRight,
  cilSave,
  cilPeople,
  cilInfo,
  cilSchool,
  cilClock,
  cilCloudUpload,
  cilFile,
  cilX,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { incidentApi } from '../../services/incidentApi';

// Types
interface IncidentFormData {
  // Step 1: Basic Information
  incidentDateTime: Date;
  title: string;
  description: string;
  category: string;
  type: string;
  severity: string;
  urgency: string;
  isAnonymous: boolean;

  // Step 2: Location
  building: string;
  floor: string;
  room: string;
  location: string;
  specificLocation: string;
  latitude?: number;
  longitude?: number;
  qrCodeLocation?: string;

  // Step 3: People Involved
  reporterType: string;
  reportedBy: string;
  reporterEmail: string;
  reporterPhone: string;
  reporterDepartment: string;
  personAffectedType?: string;
  personAffectedName?: string;
  personAffectedId?: string;
  personAffectedDepartment?: string;
  personAffectedClass?: string;
  personAffectedAge?: number;
  personAffectedContact?: string;
  witnessNames: string[];
  witnessContacts: string[];

  // Step 4: Immediate Response
  immediateActions: string;
  firstAidProvided: string;
  emergencyServicesNotified: boolean;
  emergencyServiceType: string;
  requiresMedicalAttention: boolean;
  hospitalName: string;
  medicalTreatmentDetails: string;

  // Step 5: School Context & Parent Info
  activityType: string;
  subjectClass: string;
  teacherInCharge: string;
  supervisorPresent: string;
  studentsPresent: number;
  weatherConditions: string;
  lightingConditions: string;
  parentGuardianName?: string;
  parentGuardianContact?: string;
  parentGuardianEmail?: string;
  parentPreferredLanguage?: string;

  // Step 6: Evidence & Compliance
  photoUrls: string[];
  videoUrls: string[];
  documentUrls: string[];
  requiresBPJSReporting: boolean;
  requiresMinistryReporting: boolean;
}

// Step configuration
const FORM_STEPS = [
  { id: 1, title: 'incident.form.steps.basic', icon: cilInfo },
  { id: 2, title: 'incident.form.steps.location', icon: cilLocationPin },
  { id: 3, title: 'incident.form.steps.people', icon: cilPeople },
  { id: 4, title: 'incident.form.steps.response', icon: cilMedicalCross },
  { id: 5, title: 'incident.form.steps.context', icon: cilSchool },
  { id: 6, title: 'incident.form.steps.evidence', icon: cilCamera },
];

// Validation schemas for each step
const validationSchemas = {
  1: yup.object({
    incidentDateTime: yup.date().required('Incident date and time is required').max(new Date(), 'Cannot be in the future'),
    title: yup.string().required('Title is required').max(200),
    description: yup.string().required('Description is required').max(2000),
    category: yup.string().required('Category is required'),
    type: yup.string().required('Type is required'),
    severity: yup.string().required('Severity is required'),
    urgency: yup.string().required('Urgency is required'),
    isAnonymous: yup.boolean(),
  }),
  2: yup.object({
    building: yup.string().required('Building is required'),
    location: yup.string().required('Location is required'),
    floor: yup.string().required('Floor is required'),
  }),
  3: yup.object({
    reporterType: yup.string().required('Reporter type is required'),
    reportedBy: yup.string().when('isAnonymous', (isAnonymous, schema) => 
      isAnonymous[0] === false 
        ? schema.required('Reporter name is required')
        : schema
    ),
    reporterEmail: yup.string().email('Invalid email').required('Email is required'),
    reporterPhone: yup.string().matches(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid Indonesian phone number'),
  }),
  4: yup.object({
    immediateActions: yup.string().when(['severity', 'urgency'], ([severity, urgency], schema) => 
      (severity >= '3' || urgency >= '3')
        ? schema.required('Immediate actions required for serious incidents')
        : schema
    ),
  }),
  5: yup.object({
    parentGuardianContact: yup.string().when('personAffectedType', (personAffectedType, schema) => 
      personAffectedType[0] === '1' // Student
        ? schema.required('Parent contact required for student incidents')
        : schema
    ),
  }),
  6: yup.object({
    photoUrls: yup.array().max(10, 'Maximum 10 photos allowed'),
  }),
};

const IncidentFormEnhanced: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<IncidentFormData>>({
    incidentDateTime: new Date(),
    isAnonymous: false,
    emergencyServicesNotified: false,
    requiresMedicalAttention: false,
    requiresBPJSReporting: false,
    requiresMinistryReporting: false,
    witnessNames: [],
    witnessContacts: [],
    photoUrls: [],
    videoUrls: [],
    documentUrls: [],
    parentPreferredLanguage: i18n.language,
  });
  
  const [dropdownData, setDropdownData] = useState({
    categories: [],
    types: [],
    severities: [],
    urgencies: [],
    personTypes: [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationLoading, setLocationLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    photos: File[];
    videos: File[];
    documents: File[];
  }>({ photos: [], videos: [], documents: [] });

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        console.log('Loading dropdown data...');
        
        const [categories, types, severities, urgencies, personTypes] = await Promise.all([
          incidentApi.get('/api/incident/categories'),
          incidentApi.get('/api/incident/types'),
          incidentApi.get('/api/incident/severities'),
          incidentApi.get('/api/incident/urgencies'),
          incidentApi.get('/api/incident/person-types'),
        ]);
        
        console.log('API Responses:', { categories, types, severities, urgencies, personTypes });
        
        // Handle the response format - the data might be directly in the response
        const getDataArray = (response: any) => {
          if (response.success && Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          }
          return [];
        };
        
        setDropdownData({
          categories: getDataArray(categories),
          types: getDataArray(types),
          severities: getDataArray(severities),
          urgencies: getDataArray(urgencies),
          personTypes: getDataArray(personTypes),
        });
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
        // toast.error(t('incident.form.errors.loadingData'));
        
        // Set empty arrays as fallback
        setDropdownData({
          categories: [],
          types: [],
          severities: [],
          urgencies: [],
          personTypes: [],
        });
      }
    };

    loadDropdownData();
  }, [t]);

  // Get current step validation schema
  const getCurrentValidationSchema = () => {
    return validationSchemas[currentStep as keyof typeof validationSchemas] || yup.object({});
  };

  // Validate current step
  const validateStep = async (): Promise<boolean> => {
    try {
      const schema = getCurrentValidationSchema();
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Navigate between steps
  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < FORM_STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleFieldChange('latitude', position.coords.latitude);
          handleFieldChange('longitude', position.coords.longitude);
          setLocationLoading(false);
          toast.success(t('incident.form.location.captured'));
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error(t('incident.form.location.error'));
          setLocationLoading(false);
        }
      );
    } else {
      toast.error(t('incident.form.location.notSupported'));
      setLocationLoading(false);
    }
  };

  // Handle file uploads
  const handleFileUpload = async (files: FileList, type: 'photos' | 'videos' | 'documents') => {
    const maxSizes = {
      photos: 5 * 1024 * 1024, // 5MB
      videos: 50 * 1024 * 1024, // 50MB
      documents: 10 * 1024 * 1024, // 10MB
    };

    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSizes[type]) {
        toast.error(t('incident.form.files.tooLarge', { type, size: maxSizes[type] / 1024 / 1024 }));
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...validFiles],
    }));

    // In real implementation, upload to server and get URLs
    // For now, create dummy URLs
    const dummyUrls = validFiles.map(file => URL.createObjectURL(file));
    const fieldName = `${type.slice(0, -1)}Urls` as keyof IncidentFormData;
    handleFieldChange(fieldName, [...(formData[fieldName] as string[] || []), ...dummyUrls]);
  };

  // Remove uploaded file
  const removeFile = (index: number, type: 'photos' | 'videos' | 'documents') => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    const fieldName = `${type.slice(0, -1)}Urls` as keyof IncidentFormData;
    handleFieldChange(
      fieldName,
      (formData[fieldName] as string[]).filter((_, i) => i !== index)
    );
  };

  // Submit form
  const handleSubmit = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    setLoading(true);
    try {
      const endpoint = formData.isAnonymous ? '/api/incident/anonymous' : '/api/incident';
      const response = await incidentApi.post(endpoint, formData);

      if (response.success) {
        toast.success(t('incident.form.success'));
        if (formData.isAnonymous && response.data?.incidentNumber) {
          // Show tracking code for anonymous reports
          toast.info(t('incident.form.trackingCode', { code: response.data.incidentNumber }), {
            autoClose: false,
          });
        }
        navigate('/incidents');
      } else {
        toast.error(response.message || t('incident.form.error'));
      }
    } catch (error) {
      console.error('Failed to submit incident:', error);
      toast.error(t('incident.form.error'));
    } finally {
      setLoading(false);
    }
  };

  // Auto-save draft
  useEffect(() => {
    const saveTimer = setInterval(() => {
      localStorage.setItem('incidentDraft', JSON.stringify(formData));
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveTimer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('incidentDraft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        toast.info(t('incident.form.draftLoaded'));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [t]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CCard>
            <CCardHeader>
              <h4>{t('incident.form.basicInfo')}</h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel>{t('incident.form.date')} *</CFormLabel>
                  <CFormInput
                    type="date"
                    value={formData.incidentDateTime ? new Date(formData.incidentDateTime).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      const timeValue = formData.incidentDateTime ? new Date(formData.incidentDateTime).toTimeString().split(' ')[0].substring(0, 5) : '12:00';
                      const combinedDateTime = new Date(`${dateValue}T${timeValue}`);
                      handleFieldChange('incidentDateTime', combinedDateTime);
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    invalid={!!errors.incidentDateTime}
                  />
                  {errors.incidentDateTime && (
                    <CFormFeedback invalid>{errors.incidentDateTime}</CFormFeedback>
                  )}
                </CCol>
                <CCol md={3}>
                  <CFormLabel>{t('incident.form.time')} *</CFormLabel>
                  <CFormInput
                    type="time"
                    value={formData.incidentDateTime ? new Date(formData.incidentDateTime).toTimeString().split(' ')[0].substring(0, 5) : ''}
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      const dateValue = formData.incidentDateTime ? new Date(formData.incidentDateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                      const combinedDateTime = new Date(`${dateValue}T${timeValue}`);
                      handleFieldChange('incidentDateTime', combinedDateTime);
                    }}
                    invalid={!!errors.incidentDateTime}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.anonymous')}</CFormLabel>
                  <CFormCheck
                    type="switch"
                    id="anonymousSwitch"
                    label={t('incident.form.reportAnonymously')}
                    checked={formData.isAnonymous}
                    onChange={(e) => handleFieldChange('isAnonymous', e.target.checked)}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.title')} *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    invalid={!!errors.title}
                    feedback={errors.title}
                    placeholder={t('incident.form.titlePlaceholder')}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.description')} *</CFormLabel>
                  <CFormTextarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    invalid={!!errors.description}
                    feedback={errors.description}
                    placeholder={t('incident.form.descriptionPlaceholder')}
                  />
                  <small className="text-muted">
                    {formData.description?.length || 0} / 2000
                  </small>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.category')} *</CFormLabel>
                  <CFormSelect
                    value={formData.category || ''}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    invalid={!!errors.category}
                    feedback={errors.category}
                  >
                    <option value="">{t('common.select')}</option>
                    {Array.isArray(dropdownData.categories) && dropdownData.categories.map((cat: any) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.display}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.type')} *</CFormLabel>
                  <CFormSelect
                    value={formData.type || ''}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    invalid={!!errors.type}
                    feedback={errors.type}
                  >
                    <option value="">{t('common.select')}</option>
                    {Array.isArray(dropdownData.types) && dropdownData.types.map((type: any) => (
                      <option key={type.value} value={type.value}>
                        {type.display}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.severity')} *</CFormLabel>
                  <CFormSelect
                    value={formData.severity || ''}
                    onChange={(e) => handleFieldChange('severity', e.target.value)}
                    invalid={!!errors.severity}
                    feedback={errors.severity}
                  >
                    <option value="">{t('common.select')}</option>
                    {Array.isArray(dropdownData.severities) && dropdownData.severities.map((sev: any) => (
                      <option key={sev.value} value={sev.value}>
                        {sev.display}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.urgency')} *</CFormLabel>
                  <CFormSelect
                    value={formData.urgency || ''}
                    onChange={(e) => handleFieldChange('urgency', e.target.value)}
                    invalid={!!errors.urgency}
                    feedback={errors.urgency}
                  >
                    <option value="">{t('common.select')}</option>
                    {Array.isArray(dropdownData.urgencies) && dropdownData.urgencies.map((urg: any) => (
                      <option key={urg.value} value={urg.value}>
                        {urg.display}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        );

      case 2:
        return (
          <CCard>
            <CCardHeader>
              <h4>{t('incident.form.locationInfo')}</h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.building')} *</CFormLabel>
                  <CFormSelect
                    value={formData.building || ''}
                    onChange={(e) => handleFieldChange('building', e.target.value)}
                    invalid={!!errors.building}
                    feedback={errors.building}
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="main">Main Building</option>
                    <option value="secondary">Secondary Building</option>
                    <option value="sports">Sports Complex</option>
                    <option value="cafeteria">Cafeteria</option>
                    <option value="library">Library</option>
                    <option value="lab">Laboratory Building</option>
                    <option value="admin">Administration</option>
                    <option value="outdoor">Outdoor Area</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.floor')} *</CFormLabel>
                  <CFormSelect
                    value={formData.floor || ''}
                    onChange={(e) => handleFieldChange('floor', e.target.value)}
                    invalid={!!errors.floor}
                    feedback={errors.floor}
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="basement">Basement</option>
                    <option value="ground">Ground Floor</option>
                    <option value="1">1st Floor</option>
                    <option value="2">2nd Floor</option>
                    <option value="3">3rd Floor</option>
                    <option value="4">4th Floor</option>
                    <option value="roof">Roof</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.room')}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.room || ''}
                    onChange={(e) => handleFieldChange('room', e.target.value)}
                    placeholder={t('incident.form.roomPlaceholder')}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.generalLocation')} *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    invalid={!!errors.location}
                    feedback={errors.location}
                    placeholder={t('incident.form.locationPlaceholder')}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.specificLocation')}</CFormLabel>
                  <CFormTextarea
                    rows={2}
                    value={formData.specificLocation || ''}
                    onChange={(e) => handleFieldChange('specificLocation', e.target.value)}
                    placeholder={t('incident.form.specificLocationPlaceholder')}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
                      <CSpinner size="sm" />
                    ) : (
                      <CIcon icon={cilLocationPin} />
                    )}
                    {' '}{t('incident.form.captureGPS')}
                  </CButton>
                  {formData.latitude && formData.longitude && (
                    <div className="mt-2">
                      <CBadge color="success">
                        GPS: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </CBadge>
                    </div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        );

      case 3:
        return (
          <CCard>
            <CCardHeader>
              <h4>{t('incident.form.peopleInvolved')}</h4>
            </CCardHeader>
            <CCardBody>
              {/* Reporter Information */}
              <h5 className="mb-3">{t('incident.form.reporterInfo')}</h5>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.reporterType')} *</CFormLabel>
                  <CFormSelect
                    value={formData.reporterType || ''}
                    onChange={(e) => handleFieldChange('reporterType', e.target.value)}
                    invalid={!!errors.reporterType}
                    feedback={errors.reporterType}
                  >
                    <option value="">{t('common.select')}</option>
                    {Array.isArray(dropdownData.personTypes) && dropdownData.personTypes.map((type: any) => (
                      <option key={type.value} value={type.value}>
                        {type.display}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.reporterName')} {!formData.isAnonymous && '*'}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.isAnonymous ? 'Anonymous' : (formData.reportedBy || '')}
                    onChange={(e) => handleFieldChange('reportedBy', e.target.value)}
                    invalid={!!errors.reportedBy}
                    feedback={errors.reportedBy}
                    disabled={formData.isAnonymous}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.reporterEmail')} *</CFormLabel>
                  <CFormInput
                    type="email"
                    value={formData.reporterEmail || ''}
                    onChange={(e) => handleFieldChange('reporterEmail', e.target.value)}
                    invalid={!!errors.reporterEmail}
                    feedback={errors.reporterEmail}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.reporterPhone')}</CFormLabel>
                  <CFormInput
                    type="tel"
                    value={formData.reporterPhone || ''}
                    onChange={(e) => handleFieldChange('reporterPhone', e.target.value)}
                    invalid={!!errors.reporterPhone}
                    feedback={errors.reporterPhone}
                    placeholder="+62..."
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.reporterDepartment')}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.reporterDepartment || ''}
                    onChange={(e) => handleFieldChange('reporterDepartment', e.target.value)}
                  />
                </CCol>
              </CRow>

              <hr />

              {/* Person Affected */}
              <h5 className="mb-3">{t('incident.form.personAffected')}</h5>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.personType')}</CFormLabel>
                  <CFormSelect
                    value={formData.personAffectedType || ''}
                    onChange={(e) => handleFieldChange('personAffectedType', e.target.value)}
                  >
                    <option value="">{t('common.select')}</option>
                    {Array.isArray(dropdownData.personTypes) && dropdownData.personTypes.map((type: any) => (
                      <option key={type.value} value={type.value}>
                        {type.display}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.personName')}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.personAffectedName || ''}
                    onChange={(e) => handleFieldChange('personAffectedName', e.target.value)}
                  />
                </CCol>
              </CRow>

              {formData.personAffectedType === '1' && ( // Student
                <>
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <CFormLabel>{t('incident.form.studentId')}</CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.personAffectedId || ''}
                        onChange={(e) => handleFieldChange('personAffectedId', e.target.value)}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>{t('incident.form.class')}</CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.personAffectedClass || ''}
                        onChange={(e) => handleFieldChange('personAffectedClass', e.target.value)}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>{t('incident.form.age')}</CFormLabel>
                      <CFormInput
                        type="number"
                        value={formData.personAffectedAge || ''}
                        onChange={(e) => handleFieldChange('personAffectedAge', parseInt(e.target.value))}
                      />
                    </CCol>
                  </CRow>
                </>
              )}

              <hr />

              {/* Witnesses */}
              <h5 className="mb-3">{t('incident.form.witnesses')}</h5>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleFieldChange('witnessNames', [...formData.witnessNames!, '']);
                      handleFieldChange('witnessContacts', [...formData.witnessContacts!, '']);
                    }}
                  >
                    {t('incident.form.addWitness')}
                  </CButton>
                </CCol>
              </CRow>
              {formData.witnessNames?.map((_, index) => (
                <CRow key={index} className="mb-2">
                  <CCol md={5}>
                    <CFormInput
                      type="text"
                      placeholder={t('incident.form.witnessName')}
                      value={formData.witnessNames![index]}
                      onChange={(e) => {
                        const newNames = [...formData.witnessNames!];
                        newNames[index] = e.target.value;
                        handleFieldChange('witnessNames', newNames);
                      }}
                    />
                  </CCol>
                  <CCol md={5}>
                    <CFormInput
                      type="text"
                      placeholder={t('incident.form.witnessContact')}
                      value={formData.witnessContacts![index]}
                      onChange={(e) => {
                        const newContacts = [...formData.witnessContacts!];
                        newContacts[index] = e.target.value;
                        handleFieldChange('witnessContacts', newContacts);
                      }}
                    />
                  </CCol>
                  <CCol md={2}>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleFieldChange('witnessNames', formData.witnessNames!.filter((_, i) => i !== index));
                        handleFieldChange('witnessContacts', formData.witnessContacts!.filter((_, i) => i !== index));
                      }}
                    >
                      <CIcon icon={cilX} />
                    </CButton>
                  </CCol>
                </CRow>
              ))}
            </CCardBody>
          </CCard>
        );

      case 4:
        return (
          <CCard>
            <CCardHeader>
              <h4>{t('incident.form.immediateResponse')}</h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.immediateActions')}</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formData.immediateActions || ''}
                    onChange={(e) => handleFieldChange('immediateActions', e.target.value)}
                    invalid={!!errors.immediateActions}
                    feedback={errors.immediateActions}
                    placeholder={t('incident.form.immediateActionsPlaceholder')}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.firstAid')}</CFormLabel>
                  <CFormTextarea
                    rows={2}
                    value={formData.firstAidProvided || ''}
                    onChange={(e) => handleFieldChange('firstAidProvided', e.target.value)}
                    placeholder={t('incident.form.firstAidPlaceholder')}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormCheck
                    type="checkbox"
                    id="emergencyServices"
                    label={t('incident.form.emergencyServicesNotified')}
                    checked={formData.emergencyServicesNotified}
                    onChange={(e) => handleFieldChange('emergencyServicesNotified', e.target.checked)}
                  />
                </CCol>
                {formData.emergencyServicesNotified && (
                  <CCol md={6}>
                    <CFormSelect
                      value={formData.emergencyServiceType || ''}
                      onChange={(e) => handleFieldChange('emergencyServiceType', e.target.value)}
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="Police">{t('incident.form.police')}</option>
                      <option value="Ambulance">{t('incident.form.ambulance')}</option>
                      <option value="Fire">{t('incident.form.fire')}</option>
                      <option value="Hospital">{t('incident.form.hospital')}</option>
                    </CFormSelect>
                  </CCol>
                )}
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormCheck
                    type="checkbox"
                    id="medicalAttention"
                    label={t('incident.form.requiresMedicalAttention')}
                    checked={formData.requiresMedicalAttention}
                    onChange={(e) => handleFieldChange('requiresMedicalAttention', e.target.checked)}
                  />
                </CCol>
              </CRow>

              {formData.requiresMedicalAttention && (
                <>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel>{t('incident.form.hospitalName')}</CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.hospitalName || ''}
                        onChange={(e) => handleFieldChange('hospitalName', e.target.value)}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormLabel>{t('incident.form.treatmentDetails')}</CFormLabel>
                      <CFormTextarea
                        rows={2}
                        value={formData.medicalTreatmentDetails || ''}
                        onChange={(e) => handleFieldChange('medicalTreatmentDetails', e.target.value)}
                      />
                    </CCol>
                  </CRow>
                </>
              )}
            </CCardBody>
          </CCard>
        );

      case 5:
        return (
          <CCard>
            <CCardHeader>
              <h4>{t('incident.form.contextInfo')}</h4>
            </CCardHeader>
            <CCardBody>
              {/* School Context */}
              <h5 className="mb-3">{t('incident.form.schoolContext')}</h5>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.activityType')}</CFormLabel>
                  <CFormSelect
                    value={formData.activityType || ''}
                    onChange={(e) => handleFieldChange('activityType', e.target.value)}
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="classroom">Classroom Lesson</option>
                    <option value="laboratory">Laboratory Activity</option>
                    <option value="sports">Sports/PE</option>
                    <option value="break">Break Time</option>
                    <option value="assembly">Assembly</option>
                    <option value="fieldtrip">Field Trip</option>
                    <option value="afterschool">After School Activity</option>
                    <option value="other">Other</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.subjectClass')}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.subjectClass || ''}
                    onChange={(e) => handleFieldChange('subjectClass', e.target.value)}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.teacherInCharge')}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.teacherInCharge || ''}
                    onChange={(e) => handleFieldChange('teacherInCharge', e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>{t('incident.form.supervisorPresent')}</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.supervisorPresent || ''}
                    onChange={(e) => handleFieldChange('supervisorPresent', e.target.value)}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel>{t('incident.form.studentsPresent')}</CFormLabel>
                  <CFormInput
                    type="number"
                    value={formData.studentsPresent || 0}
                    onChange={(e) => handleFieldChange('studentsPresent', parseInt(e.target.value))}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>{t('incident.form.weather')}</CFormLabel>
                  <CFormSelect
                    value={formData.weatherConditions || ''}
                    onChange={(e) => handleFieldChange('weatherConditions', e.target.value)}
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="sunny">Sunny</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rainy">Rainy</option>
                    <option value="stormy">Stormy</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormLabel>{t('incident.form.lighting')}</CFormLabel>
                  <CFormSelect
                    value={formData.lightingConditions || ''}
                    onChange={(e) => handleFieldChange('lightingConditions', e.target.value)}
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="good">Good</option>
                    <option value="adequate">Adequate</option>
                    <option value="poor">Poor</option>
                    <option value="dark">Dark</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Parent Information for Student Incidents */}
              {formData.personAffectedType === '1' && (
                <>
                  <hr />
                  <h5 className="mb-3">{t('incident.form.parentInfo')}</h5>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel>{t('incident.form.parentName')}</CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.parentGuardianName || ''}
                        onChange={(e) => handleFieldChange('parentGuardianName', e.target.value)}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>{t('incident.form.parentContact')} *</CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.parentGuardianContact || ''}
                        onChange={(e) => handleFieldChange('parentGuardianContact', e.target.value)}
                        invalid={!!errors.parentGuardianContact}
                        feedback={errors.parentGuardianContact}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel>{t('incident.form.parentEmail')}</CFormLabel>
                      <CFormInput
                        type="email"
                        value={formData.parentGuardianEmail || ''}
                        onChange={(e) => handleFieldChange('parentGuardianEmail', e.target.value)}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>{t('incident.form.preferredLanguage')}</CFormLabel>
                      <CFormSelect
                        value={formData.parentPreferredLanguage || 'en'}
                        onChange={(e) => handleFieldChange('parentPreferredLanguage', e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="id">Bahasa Indonesia</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </>
              )}
            </CCardBody>
          </CCard>
        );

      case 6:
        return (
          <CCard>
            <CCardHeader>
              <h4>{t('incident.form.evidenceCompliance')}</h4>
            </CCardHeader>
            <CCardBody>
              {/* Evidence Upload */}
              <h5 className="mb-3">{t('incident.form.evidence')}</h5>
              
              {/* Photos */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.photos')} ({uploadedFiles.photos.length}/10)</CFormLabel>
                  <CFormInput
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'photos')}
                    disabled={uploadedFiles.photos.length >= 10}
                  />
                  {errors.photoUrls && (
                    <div className="invalid-feedback d-block">{errors.photoUrls}</div>
                  )}
                  <div className="mt-2">
                    {uploadedFiles.photos.map((file, index) => (
                      <CBadge key={index} color="info" className="me-2 mb-2">
                        {file.name}
                        <CCloseButton
                          size="sm"
                          onClick={() => removeFile(index, 'photos')}
                          className="ms-2"
                        />
                      </CBadge>
                    ))}
                  </div>
                </CCol>
              </CRow>

              {/* Videos */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.videos')} ({uploadedFiles.videos.length}/5)</CFormLabel>
                  <CFormInput
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'videos')}
                    disabled={uploadedFiles.videos.length >= 5}
                  />
                  <div className="mt-2">
                    {uploadedFiles.videos.map((file, index) => (
                      <CBadge key={index} color="info" className="me-2 mb-2">
                        {file.name}
                        <CCloseButton
                          size="sm"
                          onClick={() => removeFile(index, 'videos')}
                          className="ms-2"
                        />
                      </CBadge>
                    ))}
                  </div>
                </CCol>
              </CRow>

              {/* Documents */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>{t('incident.form.documents')} ({uploadedFiles.documents.length}/10)</CFormLabel>
                  <CFormInput
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'documents')}
                    disabled={uploadedFiles.documents.length >= 10}
                  />
                  <div className="mt-2">
                    {uploadedFiles.documents.map((file, index) => (
                      <CBadge key={index} color="info" className="me-2 mb-2">
                        {file.name}
                        <CCloseButton
                          size="sm"
                          onClick={() => removeFile(index, 'documents')}
                          className="ms-2"
                        />
                      </CBadge>
                    ))}
                  </div>
                </CCol>
              </CRow>

              <hr />

              {/* Regulatory Compliance */}
              <h5 className="mb-3">{t('incident.form.regulatoryCompliance')}</h5>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormCheck
                    type="checkbox"
                    id="bpjsReporting"
                    label={t('incident.form.requiresBPJS')}
                    checked={formData.requiresBPJSReporting}
                    onChange={(e) => handleFieldChange('requiresBPJSReporting', e.target.checked)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormCheck
                    type="checkbox"
                    id="ministryReporting"
                    label={t('incident.form.requiresMinistry')}
                    checked={formData.requiresMinistryReporting}
                    onChange={(e) => handleFieldChange('requiresMinistryReporting', e.target.checked)}
                  />
                </CCol>
              </CRow>

              {(formData.requiresBPJSReporting || formData.requiresMinistryReporting) && (
                <CAlert color="warning">
                  <CIcon icon={cilWarning} className="me-2" />
                  {t('incident.form.regulatoryWarning')}
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        );

      default:
        return null;
    }
  };

  return (
    <CContainer fluid>
      <CRow>
        <CCol lg={12}>
          {/* Progress Bar */}
          <CCard className="mb-4">
            <CCardBody>
              <CProgress className="mb-3">
                <CProgressBar value={(currentStep / FORM_STEPS.length) * 100}>
                  {t('incident.form.step')} {currentStep} / {FORM_STEPS.length}
                </CProgressBar>
              </CProgress>
              
              {/* Step Indicators */}
              <div className="d-flex justify-content-between">
                {FORM_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`text-center ${currentStep >= step.id ? 'text-primary' : 'text-muted'}`}
                  >
                    <CIcon
                      icon={step.icon}
                      size="lg"
                      className={currentStep >= step.id ? 'text-primary' : 'text-muted'}
                    />
                    <div className="small mt-1 d-none d-md-block">
                      {t(step.title)}
                    </div>
                  </div>
                ))}
              </div>
            </CCardBody>
          </CCard>

          {/* Form Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <CCard className="mt-4">
            <CCardBody>
              <div className="d-flex justify-content-between">
                <div>
                  {currentStep > 1 && (
                    <CButton
                      color="secondary"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      <CIcon icon={cilArrowLeft} /> {t('common.previous')}
                    </CButton>
                  )}
                </div>
                
                <div>
                  <CButton
                    color="secondary"
                    variant="outline"
                    className="me-2"
                    onClick={() => navigate('/incidents')}
                  >
                    {t('common.cancel')}
                  </CButton>
                  
                  {currentStep < FORM_STEPS.length ? (
                    <CButton
                      color="primary"
                      onClick={handleNext}
                    >
                      {t('common.next')} <CIcon icon={cilArrowRight} />
                    </CButton>
                  ) : (
                    <>
                      <CButton
                        color="info"
                        variant="outline"
                        className="me-2"
                        onClick={() => setShowPreview(true)}
                      >
                        <CIcon icon={cilInfo} /> {t('common.preview')}
                      </CButton>
                      <CButton
                        color="success"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? (
                          <CSpinner size="sm" />
                        ) : (
                          <>
                            <CIcon icon={cilCheckCircle} /> {t('common.submit')}
                          </>
                        )}
                      </CButton>
                    </>
                  )}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Preview Modal */}
      <CModal
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        size="xl"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>{t('incident.form.previewTitle')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPreview(false)}>
            {t('common.close')}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default IncidentFormEnhanced;