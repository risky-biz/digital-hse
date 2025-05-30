import React, { useEffect, useState } from 'react';
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CAlert } from '@coreui/react';
import { incidentApi } from '../../services/incidentApi';

const IncidentTest: React.FC = () => {
  const [apiData, setApiData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testApi = async (endpoint: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await incidentApi.get(endpoint);
      console.log(`Response from ${endpoint}:`, response);
      setApiData(prev => ({
        ...prev,
        [endpoint]: response
      }));
    } catch (err) {
      console.error(`Error from ${endpoint}:`, err);
      setError(`Failed to fetch ${endpoint}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Test all dropdown endpoints
    testApi('/api/incident/categories');
    testApi('/api/incident/types');
    testApi('/api/incident/severities');
  }, []);

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h3>Incident API Test</h3>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {loading && <p>Loading...</p>}
          
          <h4>API Responses:</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(apiData, null, 2)}
          </pre>

          <div className="mt-3">
            <CButton color="primary" onClick={() => testApi('/api/incident/categories')}>
              Test Categories
            </CButton>
            {' '}
            <CButton color="secondary" onClick={() => testApi('/api/incident/types')}>
              Test Types
            </CButton>
            {' '}
            <CButton color="info" onClick={() => testApi('/api/incident/severities')}>
              Test Severities
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default IncidentTest;