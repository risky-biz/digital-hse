import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { logoNegative } from '@coreui/icons'
import { AppSidebarNavFixed as AppSidebarNav } from './AppSidebarNavFixed'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../../_nav'

const AppSidebar: React.FC = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: any) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: any) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex">
        <NavLink to="/" className="sidebar-brand-full d-flex align-items-center text-decoration-none">
          <img 
            src="/assets/brand/logo-placeholder.svg" 
            alt="BSJ Logo" 
            height={40} 
            className="me-2"
          />
          <div>
            <h5 className="text-white mb-0">Digital HSE</h5>
            <small className="text-white-50">The British School Jakarta</small>
          </div>
        </NavLink>
        <img 
          className="sidebar-brand-narrow" 
          src="/assets/brand/logo-placeholder.svg" 
          alt="BSJ" 
          height={35} 
        />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)