import React, { useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartBar, CChartDoughnut, CChartLine } from '@coreui/react-chartjs'
import { useApi } from '../../hooks/useApi'
import { hseApi } from '../../services/api'

const HSEDashboard: React.FC = () => {
  const { data: stats, loading } = useApi(() => hseApi.getDashboardStats())

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="dashboard-content">
      <CRow>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 hse-stat-widget"
            color="danger"
            value={stats?.openIncidents || '0'}
            title="Open Incidents"
            chart={
              <div className="chart-wrapper" style={{ height: '70px' }}>
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: stats?.incidentTrend?.labels || [],
                    datasets: [{
                      label: 'Incidents',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#c62828',
                      data: stats?.incidentTrend?.data || [],
                    }],
                  }}
                  options={{
                    animation: {
                      duration: 0
                    },
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        display: false,
                      },
                      y: {
                        display: false,
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 2,
                      },
                      point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              </div>
            }
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 hse-stat-widget"
            color="warning"
            value={stats?.overdueActions || '0'}
            title="Overdue Actions"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 hse-stat-widget"
            color="success"
            value={`${stats?.trainingCompliance || 0}%`}
            title="Training Compliance"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 hse-stat-widget"
            color="info"
            value={stats?.activePermits || '0'}
            title="Active Permits"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Risk Distribution</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['Low', 'Medium', 'High', 'Extreme'],
                  datasets: [{
                    data: stats?.riskDistribution || [0, 0, 0, 0],
                    backgroundColor: ['#689f38', '#fbc02d', '#f57c00', '#c62828'],
                    hoverBackgroundColor: ['#558b2f', '#f9a825', '#ef6c00', '#b71c1c'],
                  }],
                }}
                options={{
                  animation: {
                    duration: 0
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Incidents by Department</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: stats?.departments || [],
                  datasets: [{
                    label: 'Incidents',
                    backgroundColor: '#1b5e20',
                    data: stats?.departmentIncidents || [],
                  }],
                }}
                options={{
                  animation: {
                    duration: 0
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Recent Safety Observations</CCardHeader>
            <CCardBody>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Observer</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentObservations?.map((obs: any, index: number) => (
                      <tr key={index}>
                        <td>{new Date(obs.date).toLocaleDateString()}</td>
                        <td>{obs.location}</td>
                        <td>{obs.type}</td>
                        <td>{obs.observer}</td>
                        <td>
                          <span className={`badge bg-${obs.status === 'Open' ? 'warning' : 'success'}`}>
                            {obs.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default HSEDashboard