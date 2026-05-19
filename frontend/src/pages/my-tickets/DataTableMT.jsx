import { useEffect, useMemo, useState } from 'react'

import DialogEditTicket from '../../components/dialog/DialogEditMT.jsx'
import DialogFeedbackUser from '../../components/dialog/DialogFeedbackUser.jsx'
import DialogTimelineMT from '../../components/dialog/DialogTimelineMT.jsx'
import MobileCardMT from './MobileCardMT.jsx'

import DataTable, {
  DataTableIdentity,
  DataTableStatus,
} from '../../components/table/DataTable.jsx'
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_DATE_RANGE,
  INITIAL_TICKET_ROWS,
  PAGE_SIZE_OPTIONS,
  getFilteredTicketRows,
  getPaginationItems,
  getStatusVariant,
  getTicketEmptyMessage,
  getTicketPageRows,
  getTicketPaginationSummary,
  getTicketTableActions,
} from '../../services/my-tickets/DataTableMT.js'
import { formatTicketDate, formatTicketTimeWIB } from '../../services/my-tickets/MyTickets.js'

const columns = [
  {
    key: 'category',
    header: 'Category',
    cellStyle: { whiteSpace: 'nowrap', width: '12%' },
    render: (ticket) => ticket.category || '-',
  },
  {
    key: 'requestDate',
    header: 'Request Date',
    cellStyle: { whiteSpace: 'nowrap', minWidth: '140px' },
    render: (ticket) => (
      <div className="stacked-date">
        <div className="stacked-date__date">{formatTicketDate(ticket.requestDateValue)}</div>
        <div className="stacked-date__time" style={{ fontSize: '0.85em', opacity: 0.8 }}>
          {formatTicketTimeWIB(ticket.requestDateValue)}
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cellStyle: { whiteSpace: 'nowrap', width: '10%' },
    render: (ticket) => (
      <DataTableStatus inline variant={getStatusVariant(ticket.status)}>
        {ticket.status}
      </DataTableStatus>
    ),
  },
  {
    key: 'status_document',
    header: 'Document',
    cellStyle: { whiteSpace: 'nowrap', width: '12%' },
    render: (ticket) => {
      const val = ticket.status_document
      const displayVal = typeof val === 'string' ? val.charAt(0).toUpperCase() + val.slice(1) : '-'
      const isReady = val === 'ready'
      return (
        <span 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'capitalize',
            backgroundColor: isReady ? '#ecfdf5' : '#fef2f2',
            color: isReady ? '#059669' : '#dc2626',
            border: `1px solid ${isReady ? '#a7f3d0' : '#fecaca'}`,
          }}
        >
          <span 
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isReady ? '#10b981' : '#ef4444',
            }}
          />
          {displayVal}
        </span>
      )
    }
  },
   {
    key: 'problem',
    header: 'Problem',
    accessor: 'problem',
    cellStyle: { minWidth: '320px' },
  },
  {
    key: 'solution',
    header: 'Solution',
    accessor: 'solution',
    cellStyle: { minWidth: '320px' },
  },
  {
    key: 'support',
    header: 'Support',
    cellStyle: { minWidth: '220px' },
    render: (ticket) =>
      ticket.supportName ? <DataTableIdentity title={ticket.supportName} /> : '-',
  },
]

function DataTableMT({
  searchQuery = '',
  tableLabel = 'MyTickets table',
  dateRange = EMPTY_DATE_RANGE,
  statusFilter = '',
  ticketRows = INITIAL_TICKET_ROWS,
  isLoading = false,
  errorMessage = '',
  refreshVersion = 0,
  setTicketRows,
  refreshData,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [activeActionDialog, setActiveActionDialog] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredRows = useMemo(
    () => getFilteredTicketRows(ticketRows, { searchQuery, dateRange, statusFilter }),
    [dateRange, searchQuery, statusFilter, ticketRows],
  )
  const { totalPages, safeCurrentPage, rows, firstItem, lastItem } = useMemo(
    () => getTicketPageRows(filteredRows, currentPage, pageSize),
    [currentPage, filteredRows, pageSize],
  )
  const selectedTicketName = selectedTicket?.ticketCode ?? selectedTicket?.id ?? 'ticket ini'
  const dialogTicket = selectedTicket ? { name: selectedTicketName } : null

  const openActionDialog = (dialogType, ticket) => {
    setSelectedTicket(ticket)
    setActiveActionDialog(dialogType)
  }

  const closeActionDialog = () => {
    setActiveActionDialog(null)
    setSelectedTicket(null)
  }

  const handleEditConfirm = () => {
    refreshData?.()
    closeActionDialog()
  }

  const handleFeedbackConfirm = (result) => {
    if (result && selectedTicket?.id && typeof setTicketRows === 'function') {
      // Update the local state to reflect the status change if the API returns the updated ticket
      setTicketRows((currentRows) =>
        currentRows.map((ticket) =>
          ticket.id === selectedTicket.id
            ? { ...ticket, status: 'Feedback', rawStatus: 'feedback' }
            : ticket,
        ),
      )
    }

    // Refresh data to update status counts etc
    refreshData?.()
    closeActionDialog()
  }

  const tableActions = getTicketTableActions({
    onTimeline: (ticket) => openActionDialog('timeline', ticket),
    onEdit: (ticket) => openActionDialog('edit', ticket),
    onFeedback: (ticket) => openActionDialog('feedback', ticket),
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [dateRange.endDate, dateRange.startDate, pageSize, refreshVersion, searchQuery, statusFilter])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const pagination = {
    summary: getTicketPaginationSummary(firstItem, lastItem, filteredRows.length),
    currentPage: safeCurrentPage,
    totalPages,
    items: getPaginationItems(safeCurrentPage, totalPages),
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageSizeLabel: 'Tampilkan',
    pageSizeSuffix: 'baris',
    previousLabel: 'Sebelumnya',
    nextLabel: 'Berikutnya',
    ariaLabel: 'MyTickets pagination',
    pageSizeAriaLabel: 'Jumlah baris ticket per halaman',
    onPrevious: () => setCurrentPage((page) => Math.max(1, page - 1)),
    onNext: () => setCurrentPage((page) => Math.min(totalPages, page + 1)),
    onSelect: (page) => setCurrentPage(page),
    onPageSizeChange: (nextPageSize) => setPageSize(nextPageSize),
  }
  const emptyMessage = isLoading
    ? 'Memuat data ticket...'
    : errorMessage || getTicketEmptyMessage({ searchQuery, dateRange, statusFilter })

  return (
    <div className="mtickets-table-shell">
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)', paddingBottom: '80px' }}>
          {rows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', border: '1px dashed #ddd', borderRadius: '12px', backgroundColor: '#fafafa' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                {isLoading ? 'Memuat data...' : 'No data'}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                {isLoading ? 'Memuat data ticket...' : 'Belum ada data yang bisa ditampilkan.'}
              </div>
            </div>
          ) : (
            rows.map((ticket) => (
              <MobileCardMT
                key={ticket.id ?? ticket.ticketCode}
                ticket={ticket}
                onTimeline={() => openActionDialog('timeline', ticket)}
                onEdit={() => openActionDialog('edit', ticket)}
                onFeedback={() => openActionDialog('feedback', ticket)}
              />
            ))
          )}
        </div>
      ) : (
        <DataTable
          className="mtickets-table"
          rows={rows}
          columns={columns}
          getRowId={(ticket) => ticket.id ?? ticket.ticketCode}
          tableLabel={tableLabel}
          detail={{
            columnLabel: 'Detail',
            buttonLabel: 'Detail',
            eyebrow: 'Ticket Code',
            title: (ticket) => ticket.ticketCode,
            hasIndicator: (ticket) => ticket.status === 'Resolved',
          }}
          actions={tableActions}
          emptyMessage={emptyMessage}
          pagination={pagination}
        />
      )}

      <DialogEditTicket
        isOpen={activeActionDialog === 'edit'}
        ticket={selectedTicket}
        onClose={closeActionDialog}
        onUpdated={handleEditConfirm}
      />

      <DialogTimelineMT
        isOpen={activeActionDialog === 'timeline'}
        eyebrow="Timeline Ticket"
        title={`Status History for ${selectedTicketName}`}
        items={selectedTicket?.timeline || []}
        onClose={closeActionDialog}
      />

      <DialogFeedbackUser
        isOpen={activeActionDialog === 'feedback'}
        eyebrow="Feedback Ticket"
        title={`Give Feedback for ${selectedTicketName}`}
        ticket={selectedTicket}
        onClose={closeActionDialog}
        onConfirm={handleFeedbackConfirm}
      />
    </div>
  )
}

export default DataTableMT
