import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'

interface AppSidebarNavProps {
  items: any[]
}

export const AppSidebarNav: React.FC<AppSidebarNavProps> = ({ items }) => {
  const location = useLocation()
  
  const navLink = (name: string, icon?: any, badge?: any) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: any, index: number) => {
    const { component, name, badge, icon, to, ...rest } = item
    const Component = component
    
    if (to && !rest.items) {
      // For navigation items with routes, render as NavLink
      return (
        <Component key={index}>
          <NavLink to={to} className="nav-link">
            {navLink(name, icon, badge)}
          </NavLink>
        </Component>
      )
    }
    
    // For non-navigation items
    return (
      <Component key={index} {...rest}>
        {navLink(name, icon, badge)}
      </Component>
    )
  }

  const navGroup = (item: any, index: number) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to || '/')}
        {...rest}
      >
        {item.items?.map((item: any, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
      </Component>
    )
  }

  return (
    <>
      {items &&
        items.map((item: any, index: number) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}