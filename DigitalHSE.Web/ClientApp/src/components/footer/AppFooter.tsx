import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter: React.FC = () => {
  return (
    <CFooter>
      <div>
        <a href="https://www.bsj.sch.id" target="_blank" rel="noopener noreferrer">
          The British School Jakarta
        </a>
        <span className="ms-1">&copy; {new Date().getFullYear()} Digital HSE Management System.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)