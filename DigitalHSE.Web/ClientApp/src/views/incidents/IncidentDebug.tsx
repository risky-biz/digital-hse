import React from 'react';
import { CContainer, CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const IncidentDebug: React.FC = () => {
  const navigate = useNavigate();
  
  console.log('IncidentDebug component mounted');
  
  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h3>Incident Debug Page</h3>
        </CCardHeader>
        <CCardBody>
          <p>This is a test page to verify routing is working.</p>
          <div className="d-grid gap-2">
            <CButton color="primary" onClick={() => navigate('/incidents/new')}>
              Go to Incident Form
            </CButton>
            <CButton color="secondary" onClick={() => navigate('/incidents/list')}>
              Go to Incident List
            </CButton>
            <CButton color="info" onClick={() => navigate('/incidents')}>
              Go to Incidents
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default IncidentDebug;