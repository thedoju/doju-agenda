import { useState, useEffect } from 'react'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import {
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Sun,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import './App.css'

interface AgendaItem {
  id: string
  type: 'email' | 'calendar' | 'slack' | 'task'
  title: string
  subtitle: string
  description?: string
  suggestedAction?: string
  link?: string
  linkText?: string
  time?: string
  dueDate?: string
  priority?: 'urgent' | 'today' | 'normal'
}

interface AgendaData {
  summary: string
  weather?: { temp: number; condition: string }
  items: AgendaItem[]
}

const generateDemoData = (): AgendaData => {
  return {
    summary: "Good morning! You have 2 projects ready to send to clients, and Magnetic Brand is due tomorrow. There's also a Slack DM waiting for your response.",
    weather: { temp: 22, condition: 'Sunny' },
    items: [
      {
        id: '1',
        type: 'task',
        title: 'Orecast',
        subtitle: 'Project complete - ready to send to client',
        description: 'The branding project is complete and ready for final delivery.',
        suggestedAction: 'Send delivery email',
        priority: 'normal'
      },
      {
        id: '2',
        type: 'task',
        title: 'Magnetic Brand',
        subtitle: 'Due tomorrow',
        description: 'Branding project due January 19.',
        suggestedAction: 'Review deliverables',
        dueDate: '2026-01-19',
        priority: 'today'
      },
      {
        id: '3',
        type: 'slack',
        title: 'DM from Sarah',
        subtitle: 'Re: Project timeline update',
        description: 'Sarah is asking about the Behavoya timeline.',
        suggestedAction: 'Reply to Sarah',
        link: '#',
        linkText: 'View in Slack',
        priority: 'normal'
      },
      {
        id: '4',
        type: 'calendar',
        title: 'Design Review - Late Saints',
        subtitle: '2:00 PM - 3:00 PM',
        time: '2:00 PM',
        priority: 'normal'
      },
      {
        id: '5',
        type: 'email',
        title: 'Re: Invoice #1042',
        subtitle: 'From: accounts@clientco.com',
        description: 'Client asking about the SCHNELL ENX invoice.',
        suggestedAction: 'Send payment details',
        priority: 'normal'
      },
      {
        id: '6',
        type: 'task',
        title: 'Late Saints',
        subtitle: 'Overdue - was due yesterday',
        dueDate: '2026-01-17',
        priority: 'urgent'
      }
    ]
  }
}

const ItemIcon = ({ type, priority }: { type: string; priority?: string }) => {
  const iconClass = `item-icon ${type} ${priority === 'urgent' ? 'overdue' : ''}`
  switch (type) {
    case 'email': return <Mail className={iconClass} />
    case 'calendar': return <Calendar className={iconClass} />
    case 'slack': return <MessageSquare className={iconClass} />
    case 'task': return priority === 'urgent' ? <AlertCircle className={iconClass} /> : <CheckCircle2 className={iconClass} />
    default: return <CheckCircle2 className={iconClass} />
  }
}

const PriorityBadge = ({ priority }: { priority?: string }) => {
  if (!priority || priority === 'normal') return null
  return (
    <span className={`priority-badge ${priority}`}>
      {priority === 'urgent' ? 'Overdue' : 'Due today'}
    </span>
  )
}

const AgendaItemCard = ({ item }: { item: AgendaItem }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`item-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
      <div className="item-header">
        <ItemIcon type={item.type} priority={item.priority} />
        <div className="item-content">
          <div className="item-title">{item.title}<PriorityBadge priority={item.priority} /></div>
          <div className="item-subtitle">{item.subtitle}</div>
        </div>
        {item.time && <span className="time-badge">{item.time}</span>}
        <ChevronRight className="item-arrow" size={16} style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </div>
      {expanded && (
        <div className="item-expanded">
          {item.description && <p className="item-description">{item.description}</p>}
          {item.suggestedAction && <div className="item-task"><span className="item-task-dot" />{item.suggestedAction}</div>}
          <div className="item-actions">
            {item.suggestedAction && (<><button className="action-btn primary">Done</button><button className="action-btn secondary">Ignore</button></>)}
            {item.link && <a href={item.link} className="action-link" onClick={(e) => e.stopPropagation()}>{item.linkText || 'View'} <ExternalLink size={12} /></a>}
          </div>
          <textarea className="note-input" placeholder="Add a note or reminder..." rows={1} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

function App() {
  const [data, setData] = useState<AgendaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const response = await fetch('https://doju.app.n8n.cloud/webhook/daily-agenda')
      if (response.ok) {
        const webhookData = await response.json()
        setData(transformWebhookData(webhookData))
      } else {
        setData(generateDemoData())
      }
    } catch {
      setData(generateDemoData())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const transformWebhookData = (webhookData: any): AgendaData => {
    const items: AgendaItem[] = []
    if (webhookData.emails?.length > 0) {
      webhookData.emails.filter((email: any) => {
        const subject = (email.subject || '').toLowerCase()
        const from = (email.from || '').toLowerCase()
        return !subject.includes('unsubscribe') && !subject.includes('newsletter') && !from.includes('noreply')
      }).slice(0, 5).forEach((email: any, index: number) => {
        items.push({ id: `email-${index}`, type: 'email', title: email.subject || 'No subject', subtitle: `From: ${email.from || 'Unknown'}`, description: email.snippet, suggestedAction: 'Reply to email' })
      })
    }
    if (webhookData.calendar_events?.length > 0) {
      webhookData.calendar_events.forEach((event: any, index: number) => {
        const startTime = event.start?.dateTime ? format(parseISO(event.start.dateTime), 'h:mm a') : 'All day'
        items.push({ id: `cal-${index}`, type: 'calendar', title: event.summary || 'Untitled', subtitle: startTime, time: startTime })
      })
    }
    if (webhookData.asana_tasks?.length > 0) {
      webhookData.asana_tasks.forEach((task: any, index: number) => {
        const isOverdue = task.due_on && isPast(parseISO(task.due_on)) && !isToday(parseISO(task.due_on))
        const isDueToday = task.due_on && (isToday(parseISO(task.due_on)) || isTomorrow(parseISO(task.due_on)))
        let priority: 'urgent' | 'today' | 'normal' = isOverdue ? 'urgent' : isDueToday ? 'today' : 'normal'
        items.push({ id: `task-${index}`, type: 'task', title: task.name, subtitle: task.completed ? 'Ready to send to client' : task.due_on ? `Due ${format(parseISO(task.due_on), 'MMM d')}` : 'No due date', dueDate: task.due_on, priority, suggestedAction: task.completed ? 'Send delivery email' : undefined })
      })
    }
    items.sort((a, b) => ({ urgent: 0, today: 1, normal: 2 }[a.priority || 'normal'] || 2) - ({ urgent: 0, today: 1, normal: 2 }[b.priority || 'normal'] || 2))
    const urgentCount = items.filter(i => i.priority === 'urgent').length
    const todayCount = items.filter(i => i.priority === 'today').length
    const meetingCount = items.filter(i => i.type === 'calendar').length
    let summary = 'Good morning! '
    if (urgentCount > 0) summary += `You have ${urgentCount} overdue item${urgentCount > 1 ? 's' : ''}. `
    if (todayCount > 0) summary += `${todayCount} thing${todayCount > 1 ? 's' : ''} due today. `
    if (meetingCount > 0) summary += `${meetingCount} meeting${meetingCount > 1 ? 's' : ''} on your calendar.`
    return { summary: summary || "You're all caught up!", weather: { temp: 22, condition: 'Sunny' }, items }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <div className="app"><div className="loading-state"><div className="loading-spinner" /><span>Loading your agenda...</span></div></div>

  return (
    <div className="app">
      <header className="header">
        <div className="date-row">
          <span className="date-dot" />
          <span className="date-text">{format(new Date(), 'EEEE, MMMM d')}</span>
          <button className={`refresh-btn ${refreshing ? 'loading' : ''}`} onClick={() => fetchData(true)} disabled={refreshing}><RefreshCw size={16} /></button>
        </div>
        {data?.weather && <div className="weather-badge"><Sun size={14} />{data.weather.temp}°C, {data.weather.condition}</div>}
        <p className="summary">{data?.summary}</p>
      </header>
      {data?.items && data.items.length > 0 ? (
        <div className="items-list">{data.items.map((item) => <AgendaItemCard key={item.id} item={item} />)}</div>
      ) : (
        <div className="empty-state"><h3>All clear!</h3><p>No items need your attention.</p></div>
      )}
    </div>
  )
}

export default App