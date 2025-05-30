import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilEnvelopeOpen,
  cilMenu,
  cilAccountLogout,
  cilSettings,
  cilUser,
  cilLanguage,
} from '@coreui/icons'

import AppBreadcrumb from './AppBreadcrumb'

const AppHeader: React.FC = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state: any) => state.sidebarShow)

  // Mock user data - replace with actual user from auth context
  const currentUser = {
    name: 'John Doe',
    role: 'HSE Manager',
    avatar: '/avatars/default.jpg'
  }

  // Language toggle handler
  const handleLanguageChange = (lang: string) => {
    // TODO: Implement i18next language change
    console.log('Changing language to:', lang)
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none">
          <NavLink to="/" className="text-decoration-none">
            <h5 className="mb-0">Digital HSE</h5>
          </NavLink>
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink as={NavLink} to="/dashboard">
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/incidents/new">
              Report Incident
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/permits/active">
              Active Permits
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          {/* Notifications */}
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
              <CBadge color="danger" position="top-end" shape="pill">
                5
              </CBadge>
            </CNavLink>
          </CNavItem>
          
          {/* Messages */}
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
              <CBadge color="info" position="top-end" shape="pill">
                3
              </CBadge>
            </CNavLink>
          </CNavItem>
          
          {/* Language Selector */}
          <CDropdown variant="nav-item">
            <CDropdownToggle className="py-0" caret={false}>
              <CIcon icon={cilLanguage} size="lg" />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
              <CDropdownItem onClick={() => handleLanguageChange('en')}>
                <span className="flag-icon flag-icon-gb me-2"></span>
                English
              </CDropdownItem>
              <CDropdownItem onClick={() => handleLanguageChange('id')}>
                <span className="flag-icon flag-icon-id me-2"></span>
                Bahasa Indonesia
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          
          {/* User Menu */}
          <CDropdown variant="nav-item">
            <CDropdownToggle className="py-0" caret={false}>
              <div className="avatar-container d-flex align-items-center">
                <div className="me-2 d-none d-md-block text-end">
                  <div className="fw-semibold">{currentUser.name}</div>
                  <small className="text-medium-emphasis">{currentUser.role}</small>
                </div>
                <div className="avatar bg-primary text-white">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
              <CDropdownItem href="#/profile">
                <CIcon icon={cilUser} className="me-2" />
                Profile
              </CDropdownItem>
              <CDropdownItem href="#/settings">
                <CIcon icon={cilSettings} className="me-2" />
                Settings
              </CDropdownItem>
              <CDropdownDivider />
              <CDropdownItem href="#/logout">
                <CIcon icon={cilAccountLogout} className="me-2" />
                Logout
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader