import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

interface LoginFormData {
  username: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: {
    id: number
    username: string
    email: string
    fullName: string
    department: string
    position: string
    roles: string[]
    permissions: string[]
  }
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
    // Clear general error
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data: LoginResponse = await response.json()
      
      // Store authentication data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Redirect based on user role - simplified for now to dashboard
      navigate('/dashboard')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit} noValidate>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    
                    {error && (
                      <CAlert color="danger" className="mb-3">
                        {error}
                      </CAlert>
                    )}
                    
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        invalid={!!fieldErrors.username}
                        disabled={isLoading}
                      />
                      <CFormFeedback invalid>{fieldErrors.username}</CFormFeedback>
                    </CInputGroup>
                    
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        invalid={!!fieldErrors.password}
                        disabled={isLoading}
                      />
                      <CFormFeedback invalid>{fieldErrors.password}</CFormFeedback>
                    </CInputGroup>
                    
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Signing in...
                            </>
                          ) : (
                            'Login'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton 
                          color="link" 
                          className="px-0"
                          disabled={isLoading}
                          onClick={() => {
                            // TODO: Implement forgot password functionality
                            alert('Forgot password functionality will be implemented soon')
                          }}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Digital HSE</h2>
                    <p className="mt-3">
                      Health, Safety & Environment Management System
                    </p>
                    <p>
                      <strong>The British School Jakarta</strong>
                    </p>
                    <p className="mt-4">
                      Ensuring a safe and healthy environment for our school community
                    </p>
                    <div className="mt-4">
                      <small className="text-white-50">
                        Secure access to HSE management tools and incident reporting
                      </small>
                    </div>
                    <div className="mt-4">
                      <small className="text-white-75">
                        <strong>Demo Accounts:</strong><br/>
                        Admin: admin / admin123<br/>
                        HSE Manager: hsemanager / hse123<br/>
                        HSE Officer: hseofficer / hse123<br/>
                        Teacher: teacher / teacher123<br/>
                        Student: student / student123
                      </small>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login