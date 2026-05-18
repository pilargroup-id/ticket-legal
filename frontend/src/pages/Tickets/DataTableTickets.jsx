import { useEffect, useMemo, useState } from 'react'

import DialogVoidTickets from '../../components/dialog/DialogVoidTickets.jsx'
import DialogExecutionTicket from '../../components/dialog/DialogExecutionTicket.jsx'
import DataTable, { DataTableIdentity, DataTableStatus } from '../../components/table/DataTable.jsx'
import { Play, XClose } from '../../components/template/TemplateIcons.jsx'
import ButtonExecutionTickets from '../../components/button/ButtonExecutionTickets.jsx'
import ButtonVoidTickets from '../../components/button/ButtonVoidTickets.jsx'
import ButtonHistoryPrj from '../../components/button/ButtonHistoryPrj.jsx'
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_DATE_RANGE,
  INITIAL_TICKET_ROWS as DEFAULT_TICKET_ROWS,
  PAGE_SIZE_OPTIONS,
  getFilteredTicketRows,
  getPaginationItems,
  getStatusVariant,
  getTicketEmptyMessage,
  getTicketPageRows,
  getTicketPaginationSummary,
} from '../../services/my-tickets/DataTableMT.js'

import { formatTicketDate, formatTicketTimeWIB, getFeedbacks } from '../../services/tickets/Tickets.js'
import FeedbackRating from '../../components/rating/RatingFeedBack.jsx'

export const INITIAL_TICKET_ROWS = DEFAULT_TICKET_ROWS

const columns = [
  {
    key: 'namaPembuat',
    header: 'nama pembuat',
    accessor: 'namaPembuat',
    cellStyle: { minWidth: '170px' },
    render: (ticket) =>
      ticket.requestor && ticket.requestor !== '-'
        ? <DataTableIdentity title={ticket.requestor} />
        : '-',
  },
  {
    key: 'requestDate',
    header: 'request date',
    cellStyle: { minWidth: '140px' },
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
    key: 'category',
    header: 'category',
    accessor: 'category',
    cellStyle: { minWidth: '200px' },
  },
  {
    key: 'status',
    header: 'status',
    cellStyle: { whiteSpace: 'nowrap', width: '10%' },
    render: (ticket) => (
      <DataTableStatus inline variant={getStatusVariant(ticket.status)}>
        {ticket.status}
      </DataTableStatus>
    ),
  },
  {
    key: 'status_document',
    header: 'status document',
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
    header: 'problem',
    accessor: 'problem',
    cellStyle: { minWidth: '260px' },
  },
  {
    key: 'solution',
    header: 'solution',
    accessor: 'solution',
    cellStyle: { minWidth: '260px' },
  },
  {
    key: 'supportName',
    header: 'support name',
    accessor: 'supportName',
    cellStyle: { minWidth: '180px' },
    render: (ticket) =>
      ticket.supportName && ticket.supportName !== '-'
        ? <DataTableIdentity title={ticket.supportName} />
        : '-',
  },
]

function TicketFeedbackPanel({ ticket }) {
  const [feedback, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      try {
        const data = await getFeedbacks()
        const list = data?.list || []
        // Use a more flexible match: check ticket_id (number/string) and ticket_code
        const found = list.find(
          (f) =>
            String(f.ticket_id) === String(ticket.id) ||
            f.ticket_code === ticket.ticketCode ||
            f.ticket_code === ticket.id,
        )
        setFeedback(found)
      } catch (error) {
        console.error('Failed to load feedback:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadFeedback()
  }, [ticket.id, ticket.ticketCode])

  return (
    <section className="users-table__detail-section users-table__detail-section--wide">
      <div className="users-table__detail-section-header">
        <p className="users-table__detail-section-eyebrow">Feedback</p>
      </div>
      {isLoading ? (
        <p className="users-table__detail-empty">Memuat feedback...</p>
      ) : feedback ? (
        <div
          className="ticket-feedback"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div className="ticket-feedback__item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--template-fg-muted)' }}>Rating:</strong>{' '}
            <FeedbackRating value={Number(feedback.rating)} />
          </div>
          <div className="ticket-feedback__item">
            {/* <strong style={{ color: 'var(--template-fg-muted)' }}></strong>{' '} */}
            <p style={{ marginTop: '0.25rem', color: 'var(--template-fg-primary)' }}>
              {feedback.description || feedback.comment || '-'}
            </p>
          </div>
        </div>
      ) : (
        <p className="users-table__detail-empty">Belum ada feedback untuk tiket ini.</p>
      )}
    </section>
  )
}

function DataTableTickets({
  searchQuery = '',
  tableLabel = 'Tickets Overview table',
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

  const filteredRows = useMemo(
    () => getFilteredTicketRows(ticketRows, { searchQuery, dateRange, statusFilter }),
    [dateRange, searchQuery, statusFilter, ticketRows],
  )
  const { totalPages, safeCurrentPage, rows, firstItem, lastItem } = useMemo(
    () => getTicketPageRows(filteredRows, currentPage, pageSize),
    [currentPage, filteredRows, pageSize],
  )
  const selectedTicketName =
    selectedTicket?.ticketCode ?? selectedTicket?.userName ?? selectedTicket?.id ?? 'ticket ini'
  const dialogTicket = selectedTicket ? { name: selectedTicketName } : null

  const openActionDialog = (dialogType, ticket) => {
    setSelectedTicket(ticket)
    setActiveActionDialog(dialogType)
  }

  const closeActionDialog = () => {
    setActiveActionDialog(null)
    setSelectedTicket(null)
  }

  const updateTicketStatus = (ticketId, updatedTicket) => {
    if (ticketId && typeof setTicketRows === 'function') {
      setTicketRows((currentRows) =>
        currentRows.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, ...updatedTicket }
            : ticket,
        ),
      )
    }

    // Refresh global data to update counts etc
    refreshData?.()
    closeActionDialog()
  }

  const handleExecutionConfirm = (updatedData) => {
    // If updatedData is provided (from the API response), use it to update the row
    if (updatedData) {
      updateTicketStatus(selectedTicket.id, {
        ...updatedData,
        // Map raw status to display status if needed, or assume the API returns what we need
        status: updatedData.status === 'in_progress' ? 'In Progress' :
          updatedData.status === 'resolved' ? 'Resolved' :
            updatedData.status === 'waiting' ? 'Waiting' :
              updatedData.status === 'void' ? 'Void' : updatedData.status
      })
    } else {
      // Fallback for manual updates if API didn't return data
      updateTicketStatus(selectedTicket.id, { rawStatus: 'in_progress', status: 'In Progress' })
    }
  }

  const handleVoidConfirm = (updatedData) => {
    if (updatedData) {
      updateTicketStatus(selectedTicket.id, {
        ...updatedData,
        status: updatedData.status === 'void' ? 'Void' : updatedData.status
      })
    } else {
      updateTicketStatus(selectedTicket.id, { rawStatus: 'void', status: 'Void' })
    }
  }


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
    ariaLabel: 'Tickets pagination',
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
      <DataTable
        className="mtickets-table"
        rows={rows}
        columns={columns}
        getRowId={(ticket) => ticket.id ?? ticket.ticketCode}
        tableLabel={tableLabel}
        detail={{
          columnLabel: 'Action',
          buttonLabel: 'Detail',
          eyebrow: 'Ticket',
          title: (ticket) => ticket.ticketCode || ticket.id,
          description: (ticket) => ticket.problem,
          headerActions: (ticket) => {
            const statusStr = String(ticket?.rawStatus || ticket?.status || '').trim().toLowerCase()
            const isWaiting = statusStr === 'waiting'
            const isVoid = statusStr === 'void'
            const isResolved = statusStr === 'resolved'
            const isFeedback = statusStr === 'feedback'

            if (isResolved || isVoid || isFeedback) return null

            return (
              <div className="users-table__accordion-actions" style={{ gap: '0.5rem' }}>
                <ButtonExecutionTickets
                  tone="warning"
                  disabled={!isWaiting}
                  onClick={(event) => {
                    event.stopPropagation()
                    openActionDialog('execution', ticket)
                  }}
                >
                  <Play size={16} /> Execution
                </ButtonExecutionTickets>
                <ButtonVoidTickets
                  tone="danger"
                  disabled={isVoid}
                  onClick={(event) => {
                    event.stopPropagation()
                    openActionDialog('void', ticket)
                  }}
                >
                  <XClose size={16} /> Void
                </ButtonVoidTickets>
              </div>
            )
          },
          render: (ticket) => <TicketFeedbackPanel ticket={ticket} />,
        }}
        emptyMessage={emptyMessage}
        pagination={pagination}
      />

      <DialogExecutionTicket
        isOpen={activeActionDialog === 'execution'}
        eyebrow="Execution Ticket"
        title={`Execution ${selectedTicketName}`}
        ticket={selectedTicket}
        description={
          <>
            Ticket <strong>{selectedTicketName}</strong> akan dipindahkan ke proses execution.
          </>
        }
        secondaryDescription="Status ticket akan diperbarui menjadi In Progress pada tabel aktif."
        confirmLabel="Execution"
        user={dialogTicket}
        onClose={closeActionDialog}
        onConfirm={handleExecutionConfirm}
      />

      <DialogVoidTickets
        isOpen={activeActionDialog === 'void'}
        eyebrow="Void Ticket"
        title={`Void ${selectedTicketName}`}
        ticket={selectedTicket}
        description={
          <>
            Apakah Anda yakin ingin mengubah <strong>{selectedTicketName}</strong> menjadi void?
          </>
        }
        secondaryDescription="Status ticket akan diperbarui menjadi Void pada tabel aktif."
        confirmLabel="Void"
        onClose={closeActionDialog}
        onConfirm={handleVoidConfirm}
      />
    </div>
  )
}

export default DataTableTickets
