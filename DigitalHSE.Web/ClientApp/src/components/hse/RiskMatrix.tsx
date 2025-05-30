import React from 'react'
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'

interface RiskMatrixProps {
  onCellClick?: (likelihood: number, consequence: number) => void
  selectedCell?: { likelihood: number; consequence: number }
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ onCellClick, selectedCell }) => {
  const consequences = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']
  const likelihoods = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain']

  const getRiskClass = (likelihood: number, consequence: number): string => {
    const score = likelihood * consequence
    if (score >= 20) return 'risk-extreme'
    if (score >= 15) return 'risk-high'
    if (score >= 10) return 'risk-medium'
    return 'risk-low'
  }

  const getRiskLabel = (likelihood: number, consequence: number): string => {
    const score = likelihood * consequence
    if (score >= 20) return 'Extreme'
    if (score >= 15) return 'High'
    if (score >= 10) return 'Medium'
    return 'Low'
  }

  const isSelected = (l: number, c: number): boolean => {
    return selectedCell?.likelihood === l && selectedCell?.consequence === c
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Risk Assessment Matrix</strong>
      </CCardHeader>
      <CCardBody>
        <CTable bordered className="hse-risk-matrix text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Likelihood \ Consequence</CTableHeaderCell>
              {consequences.map((cons, index) => (
                <CTableHeaderCell key={index}>{cons}</CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {likelihoods.map((likelihood, lIndex) => (
              <CTableRow key={lIndex}>
                <CTableHeaderCell>{likelihood}</CTableHeaderCell>
                {consequences.map((_, cIndex) => {
                  const l = likelihoods.length - lIndex
                  const c = cIndex + 1
                  const riskClass = getRiskClass(l, c)
                  const riskLabel = getRiskLabel(l, c)
                  const selected = isSelected(l, c)
                  
                  return (
                    <CTableDataCell
                      key={cIndex}
                      className={`${riskClass} ${selected ? 'selected' : ''}`}
                      onClick={() => onCellClick && onCellClick(l, c)}
                      style={{ 
                        cursor: onCellClick ? 'pointer' : 'default',
                        fontWeight: selected ? 'bold' : 'normal',
                        border: selected ? '3px solid #333' : undefined
                      }}
                    >
                      {riskLabel}
                      <br />
                      <small>({l * c})</small>
                    </CTableDataCell>
                  )
                })}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="mt-3">
          <span className="badge risk-low me-2">Low (1-5)</span>
          <span className="badge risk-medium me-2">Medium (6-12)</span>
          <span className="badge risk-high me-2">High (15-16)</span>
          <span className="badge risk-extreme">Extreme (20-25)</span>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default RiskMatrix