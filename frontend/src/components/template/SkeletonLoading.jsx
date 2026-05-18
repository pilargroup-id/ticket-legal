import React, { useState, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

function SkeletonLoading({ pageType = '' }) {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const path = pageType || ''
  
  // Route identification
  const isMyTickets = path === '/MyTickets'
  const isTicketsOverview = path === '/TicketsOverview'
  const isOverviewPage = isMyTickets || isTicketsOverview || path.toLowerCase().includes('overview')
  const isTeamPerformance = path === '/Reports/TeamPerformance'
  const isExecutiveInsight = path === '/Reports/ExecutiveInsights'
  const isProjectPerformance = path === '/Reports/ProjectPerformance'
  const isMasterCategory = path === '/Master/Category'
  
  const isReportPage =
    isTeamPerformance ||
    isExecutiveInsight ||
    isProjectPerformance ||
    path.toLowerCase().includes('report') ||
    path.toLowerCase().includes('performance') ||
    path.toLowerCase().includes('insight')

  // Curated elegant light theme skeleton styles
  const skeletonSx = {
    bgcolor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: '4px',
  }

  const skeletonLightSx = {
    bgcolor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: '4px',
  }

  // Accent colors matching status cards exactly to prevent color-flashes
  const statusColors = ['#ffa500', '#007bff', '#28a745', '#ffc107', '#dc3545']
  const statusLabels = ['Waiting', 'In Progress', 'Resolved', 'Feedback', 'Void']

  // 1. MOBILE OVERVIEW PAGE SKELETON (My Tickets / Tickets Overview)
  if (isMobile && isOverviewPage) {
    return (
      <div 
        className="dashboard-content" 
        style={{ 
          animation: 'fadeIn 0.25s ease-out',
          paddingTop: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Title */}
        <div style={{ padding: '0 4px', display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="rounded" width={130} height={24} sx={skeletonSx} />
        </div>

        {/* Scrollable status pills */}
        <div style={{ display: 'flex', gap: '8px', padding: '6px 16px 8px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton 
              key={i} 
              variant="rounded" 
              width={76} 
              height={28} 
              sx={{ ...skeletonSx, borderRadius: '999px', flexShrink: 0 }} 
            />
          ))}
        </div>

        {/* List of gorgeous ticket card skeletons matching the requested image exactly! */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: '1px solid #f1f5f9',
                width: '100%',
              }}
            >
              {/* Top Section: Avatar/Category icon on left, title beside, status pill on right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Circular/Rounded Category Icon */}
                  <Skeleton
                    variant="circular"
                    width={46}
                    height={46}
                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', borderRadius: '12px' }}
                  />
                  {/* Two lines next to it (Ticket ID & Category) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Skeleton variant="rounded" width={80} height={14} sx={skeletonSx} />
                    <Skeleton variant="rounded" width={110} height={12} sx={skeletonLightSx} />
                  </div>
                </div>
                {/* Status Pill */}
                <Skeleton variant="rounded" width={75} height={24} sx={{ ...skeletonSx, borderRadius: '12px' }} />
              </div>

              {/* Middle Section: Large Rectangular Description Box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton
                  variant="rectangular"
                  width="85%"
                  height={20}
                  sx={{ ...skeletonLightSx, borderRadius: '6px' }}
                />
                <Skeleton variant="circular" width={16} height={16} sx={skeletonLightSx} />
              </div>

              {/* Users Row: Requester & Support columns */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', gap: '6px', flexDirection: 'column' }}>
                  <Skeleton variant="text" width={50} height={10} sx={skeletonLightSx} />
                  <Skeleton variant="rounded" width={90} height={13} sx={skeletonSx} />
                </div>
                <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '2px 0' }} />
                <div style={{ flex: 1, display: 'flex', gap: '6px', flexDirection: 'column', paddingLeft: '8px' }}>
                  <Skeleton variant="text" width={45} height={10} sx={skeletonLightSx} />
                  <Skeleton variant="rounded" width={95} height={13} sx={skeletonSx} />
                </div>
              </div>

              {/* Divider line */}
              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              {/* Bottom Section: Meta date/time & action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Skeleton variant="rounded" width={70} height={12} sx={skeletonLightSx} />
                  <Skeleton variant="rounded" width={55} height={12} sx={skeletonLightSx} />
                </div>
                <Skeleton variant="rounded" width={80} height={28} sx={{ ...skeletonSx, borderRadius: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 2. DESKTOP OVERVIEW PAGE SKELETON (My Tickets / Tickets Overview)
  if (!isMobile && isOverviewPage) {
    return (
      <div 
        className="dashboard-content dashboard-content--mytickets"
        style={{ animation: 'fadeIn 0.25s ease-out', height: '100%', minHeight: 0 }}
      >
        {/* Status overview cards - Zero height shifting grid! */}
        <section 
          className="dashboard-overview mtickets-status-overview" 
          aria-label="Ringkasan status MyTickets loading"
        >
          {statusColors.map((color, index) => (
            <article
              className="dashboard-card mtickets-status-card"
              key={index}
              style={{ minHeight: '126px' }} // Match real card min-height exactly
            >
              <div className="card-accent-bar" style={{ backgroundColor: color }} />

              <div className="dashboard-card__badge-row">
                <div className="status-badge">
                  <span className="status-indicator" style={{ backgroundColor: color }} />
                  <span className="dashboard-card__label" style={{ display: 'inline-block' }}>
                    {statusLabels[index]}
                  </span>
                </div>
              </div>

              <strong className="dashboard-card__value mtickets-status-card__value" style={{ display: 'block', marginTop: '4px' }}>
                <Skeleton variant="rounded" width={40} height={34} sx={skeletonSx} />
              </strong>

              <div className="dashboard-card__footer-text" style={{ opacity: 0.6 }}>
                Click to filter
              </div>
            </article>
          ))}
        </section>

        {/* Table Panel Container - Matches loaded layout exactly! */}
        <section 
          className="dashboard-panel users-table-card mytickets-table-card" 
          style={{ padding: '24px' }}
        >
          <div className="users-table-card__header mytickets-table-card__header" style={{ marginBottom: '24px' }}>
            <div className="mytickets-table-card__title-group">
              <h1 className="dashboard-panel__title mytickets-table-card__title">
                {isMyTickets ? 'My Tickets' : 'Tickets Overview'}
              </h1>
            </div>

            <div className="users-table-card__actions">
              <Skeleton variant="rounded" width={130} height={36} sx={skeletonSx} />
              <Skeleton variant="rounded" width={140} height={36} sx={skeletonSx} />
            </div>
          </div>

          {/* Table Header and Rows skeleton with perfect alignment */}
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                alignItems: 'center',
              }}
            >
              <Skeleton variant="rounded" width="12%" height={18} sx={skeletonSx} />
              <Skeleton variant="rounded" width="15%" height={18} sx={skeletonSx} />
              <Skeleton variant="rounded" width="10%" height={18} sx={skeletonSx} />
              <Skeleton variant="rounded" width="12%" height={18} sx={skeletonSx} />
              <Skeleton variant="rounded" width="30%" height={18} sx={skeletonSx} />
              <Skeleton variant="rounded" width="15%" height={18} sx={skeletonSx} />
              <Skeleton variant="rounded" width="6%" height={18} sx={skeletonSx} />
            </Stack>

            {[1, 2, 3, 4, 5].map((i) => (
              <Stack
                key={i}
                direction="row"
                spacing={2}
                sx={{
                  padding: '16px',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                  opacity: 1 - i * 0.15,
                }}
              >
                <Skeleton variant="rounded" width="12%" height={20} sx={skeletonLightSx} />
                <Skeleton variant="rounded" width="15%" height={24} sx={skeletonLightSx} />
                <Skeleton variant="rounded" width="10%" height={24} sx={skeletonLightSx} />
                <Skeleton variant="rounded" width="12%" height={24} sx={skeletonLightSx} />
                <Skeleton variant="rounded" width="30%" height={20} sx={skeletonLightSx} />
                <Skeleton variant="rounded" width="15%" height={20} sx={skeletonLightSx} />
                <Skeleton variant="rounded" width="6%" height={24} sx={skeletonLightSx} />
              </Stack>
            ))}
          </Stack>
        </section>
      </div>
    )
  }

  // 3. REPORTS PAGES LOADING (Team Performance, Executive Insights, Project Performance)
  if (isReportPage) {
    return (
      <div 
        className="dashboard-content" 
        style={{ animation: 'fadeIn 0.25s ease-out' }}
      >
        {/* Header Panel - Wrap in actual white dashboard-panel card to prevent vertical jump! */}
        {(isTeamPerformance || isProjectPerformance) && (
          <article className="dashboard-panel users-table-card" style={{ padding: '24px' }}>
            <div className="users-table-card__header">
              <div>
                <p className="dashboard-panel__eyebrow">Reports</p>
                <h1 className="dashboard-panel__title">
                  {isTeamPerformance ? 'Team Performance' : 'Project Performance'}
                </h1>
                <p className="users-table-card__description" style={{ marginTop: '8px', maxWidth: '500px' }}>
                  <Skeleton variant="text" width="100%" height={16} sx={skeletonLightSx} />
                  <Skeleton variant="text" width="60%" height={16} sx={{ ...skeletonLightSx, marginTop: '4px' }} />
                </p>
              </div>

              <div className="users-table-card__actions">
                <Skeleton variant="rounded" width={110} height={36} sx={skeletonSx} />
                <Skeleton variant="rounded" width={100} height={36} sx={skeletonSx} />
              </div>
            </div>
          </article>
        )}

        {/* Charts & Grid skeletons matching exact routes */}
        <section className="chart-page" style={{ marginTop: '0px' }}>
          <div className="chart-grid">
            {/* Chart Card 1 */}
            <article className="dashboard-panel chart-card chart-card--wide">
              <div className="chart-card__header" style={{ padding: '24px 24px 0 24px' }}>
                <Skeleton variant="text" width={120} height={14} sx={{ ...skeletonSx, opacity: 0.6 }} />
                <Skeleton variant="rounded" width={220} height={24} sx={skeletonSx} />
              </div>
              <div
                className="chart-card__body"
                style={{
                  height: '320px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '16px',
                  padding: '24px 32px',
                }}
              >
                {[45, 75, 55, 90, 35, 95, 65, 80, 50, 85, 60, 100].map((h, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height={`${h}%`}
                    sx={{
                      bgcolor: 'rgba(0, 167, 111, 0.12)', // Brands teal accent outline
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                ))}
              </div>
            </article>

            {/* Chart Card 2 */}
            <article className="dashboard-panel chart-card chart-card--wide">
              <div className="chart-card__header" style={{ padding: '24px 24px 0 24px' }}>
                <Skeleton variant="text" width={140} height={14} sx={{ ...skeletonSx, opacity: 0.6 }} />
                <Skeleton variant="rounded" width={200} height={24} sx={skeletonSx} />
              </div>
              <div
                className="chart-card__body"
                style={{
                  height: '320px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '16px',
                  padding: '24px 32px',
                }}
              >
                {[30, 60, 85, 45, 90, 50, 75, 40, 80, 65, 95, 70].map((h, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height={`${h}%`}
                    sx={{
                      bgcolor: 'rgba(0, 180, 216, 0.12)', // Brands blue accent outline
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                ))}
              </div>
            </article>
          </div>

          {/* Lower section: Support details skeleton for TeamPerformance */}
          {isTeamPerformance && (
            <article className="dashboard-panel chart-card chart-card--wide" style={{ padding: '24px' }}>
              <div className="chart-card__header chart-card__header--split" style={{ marginBottom: '24px' }}>
                <div>
                  <Skeleton variant="text" width={110} height={14} sx={skeletonLightSx} />
                  <Skeleton variant="rounded" width={260} height={24} sx={skeletonSx} />
                </div>
                <Skeleton variant="rounded" width={140} height={36} sx={skeletonSx} />
              </div>
              <div className="chart-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      borderRadius: '14px',
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Skeleton variant="rounded" width={150} height={14} sx={skeletonSx} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5, 6].map((p) => (
                          <Skeleton key={p} variant="rounded" width={60} height={20} sx={{ ...skeletonLightSx, borderRadius: '999px' }} />
                        ))}
                      </div>
                    </div>
                    <Skeleton variant="rounded" width={80} height={32} sx={skeletonSx} />
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>
      </div>
    )
  }

  // 4. FALLBACK: GENERAL TABLE PAGES SKELETON (Master Category, custom tables)
  return (
    <div 
      className="dashboard-content" 
      style={{ animation: 'fadeIn 0.25s ease-out' }}
    >
      <section className="dashboard-panel users-table-card" style={{ padding: '24px' }}>
        <div className="users-table-card__header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Skeleton variant="rounded" width={160} height={28} sx={skeletonSx} />
          </div>
          <Skeleton variant="rounded" width={120} height={36} sx={skeletonSx} />
        </div>

        <Stack spacing={1}>
          {/* Table Header */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="rounded" width="10%" height={18} sx={skeletonSx} />
            <Skeleton variant="rounded" width="40%" height={18} sx={skeletonSx} />
            <Skeleton variant="rounded" width="30%" height={18} sx={skeletonSx} />
            <Skeleton variant="rounded" width="20%" height={18} sx={skeletonSx} />
          </Stack>

          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Stack
              key={i}
              direction="row"
              spacing={2}
              sx={{
                padding: '16px',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                opacity: 1 - i * 0.15,
              }}
            >
              <Skeleton variant="rounded" width="10%" height={20} sx={skeletonLightSx} />
              <Skeleton variant="rounded" width="40%" height={20} sx={skeletonLightSx} />
              <Skeleton variant="rounded" width="30%" height={20} sx={skeletonLightSx} />
              <Skeleton variant="rounded" width="20%" height={24} sx={skeletonLightSx} />
            </Stack>
          ))}
        </Stack>
      </section>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  )
}

export default SkeletonLoading
