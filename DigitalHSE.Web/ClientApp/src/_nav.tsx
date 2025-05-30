import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilWarning,
  cilTask,
  cilClipboard,
  cilEducation,
  cilFile,
  cilChartPie,
  cilShieldAlt,
} from '@coreui/icons'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Safety Management',
  },
  {
    component: CNavGroup,
    name: 'Incidents',
    to: '/incidents',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Report Incident',
        to: '/incidents/new',
      },
      {
        component: CNavItem,
        name: 'Incident List',
        to: '/incidents/list',
      },
      {
        component: CNavItem,
        name: 'Investigations',
        to: '/incidents',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Risk Management',
    to: '/risks',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Risk Matrix',
        to: '/risks/matrix',
      },
      {
        component: CNavItem,
        name: 'Risk Assessments',
        to: '/risks/assessments',
      },
      {
        component: CNavItem,
        name: 'Control Measures',
        to: '/risks/controls',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Permit to Work',
    to: '/permits',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'Active',
    },
  },
  {
    component: CNavTitle,
    name: 'Compliance',
  },
  {
    component: CNavItem,
    name: 'Training',
    to: '/training',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Documents',
    to: '/documents',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Compliance',
    to: '/compliance',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Analytics',
  },
  {
    component: CNavItem,
    name: 'Reports & Analytics',
    to: '/analytics',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]

export default _nav