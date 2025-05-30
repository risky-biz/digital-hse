import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import RiskMatrixComponent from '../../components/hse/RiskMatrix'

const RiskMatrixView: React.FC = () => {
  const handleCellClick = (likelihood: number, consequence: number) => {
    console.log(`Risk selected: Likelihood ${likelihood}, Consequence ${consequence}`)
    // TODO: Show risks filtered by this matrix position
  }

  return (
    <CRow>
      <CCol xs={12}>
        <RiskMatrixComponent onCellClick={handleCellClick} />
      </CCol>
      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>
            <strong>Risk Assessment Guidelines</strong>
          </CCardHeader>
          <CCardBody>
            <h5>Likelihood Definitions</h5>
            <ul>
              <li><strong>Rare (1)</strong>: May occur only in exceptional circumstances (less than once per 10 years)</li>
              <li><strong>Unlikely (2)</strong>: Could occur at some time (once per 5-10 years)</li>
              <li><strong>Possible (3)</strong>: Might occur at some time (once per 1-5 years)</li>
              <li><strong>Likely (4)</strong>: Will probably occur (once per year)</li>
              <li><strong>Almost Certain (5)</strong>: Is expected to occur (multiple times per year)</li>
            </ul>
            
            <h5 className="mt-4">Consequence Definitions</h5>
            <ul>
              <li><strong>Insignificant (1)</strong>: No injuries, low financial loss</li>
              <li><strong>Minor (2)</strong>: First aid treatment, medium financial loss</li>
              <li><strong>Moderate (3)</strong>: Medical treatment required, high financial loss</li>
              <li><strong>Major (4)</strong>: Extensive injuries, major financial loss</li>
              <li><strong>Severe (5)</strong>: Death or permanent disability, huge financial loss</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RiskMatrixView