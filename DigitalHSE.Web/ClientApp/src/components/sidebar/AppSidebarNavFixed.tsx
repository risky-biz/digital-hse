import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CBadge, CNavItem, CNavGroup, CNavTitle } from '@coreui/react'

interface AppSidebarNavProps {
  items: any[]
}

export const AppSidebarNavFixed: React.FC<AppSidebarNavProps> = ({ items }) => {
  const location = useLocation()
  
  const renderNavItem = (item: any, index: number) => {
    const { component: Component, name, badge, icon, to, ...rest } = item
    
    return (
      <Component key={index}>
        <NavLink to={to} className="nav-link">
          {icon && icon}
          {name && name}
          {badge && (
            <CBadge color={badge.color} className="ms-auto">
              {badge.text}
            </CBadge>
          )}
        </NavLink>
      </Component>
    )
  }

  const renderNavGroup = (item: any, index: number) => {
    const { component: Component, name, icon, to, items: groupItems, ...rest } = item
    
    return (
      <Component
        key={index}
        idx={String(index)}
        toggler={
          <>
            {icon && icon}
            {name && name}
          </>
        }
        visible={location.pathname.startsWith(to || '/')}
        {...rest}
      >
        {groupItems?.map((subItem: any, subIndex: number) =>
          subItem.items ? renderNavGroup(subItem, subIndex) : renderNavItem(subItem, subIndex)
        )}
      </Component>
    )
  }

  const renderNavTitle = (item: any, index: number) => {
    const { component: Component, name } = item
    return <Component key={index}>{name}</Component>
  }

  const renderNavElement = (item: any, index: number) => {
    if (item.component === CNavTitle) {
      return renderNavTitle(item, index)
    } else if (item.items) {
      return renderNavGroup(item, index)
    } else {
      return renderNavItem(item, index)
    }
  }

  return (
    <>
      {items && items.map((item: any, index: number) => renderNavElement(item, index))}
    </>
  )
}

export default AppSidebarNavFixed