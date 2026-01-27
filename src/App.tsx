import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { format, isToday, addDays, subDays, isSameDay, addWeeks, getDayOfYear } from 'date-fns'
import {
  ChevronDown,
  RefreshCw,
  Sun,
  ExternalLink,
  Sparkles,
  Moon,
  ChevronLeft,
  ChevronRight,
  Plus,
  GripVertical,
  Reply,
  Archive,
  Send,
  Copy,
  Play,
  Pause,
  Pin,
  Video,
  Clock,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Settings,
  Link2,
  Mail,
  Calendar
} from 'lucide-react'
import './App.css'

// Critical CSS injection - workaround for Vite dev mode CSS loading issues
// This runs immediately when the module is loaded, before React renders
;(function injectCriticalCSS() {
  if (typeof document === 'undefined' || document.getElementById('critical-css-fix')) return
  const css = `
.progress-pills { display: flex !important; gap: 4px; }
.progress-pill { flex: 1; height: 6px !important; border-radius: 3px; background: var(--bg-hover, #222222); }
.progress-pill.filled { background: var(--priority, #FCD443) !important; }
.day-calendar { display: flex; gap: 8px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-top: 12px; }
.calendar-hours { display: flex; flex-direction: column; min-width: 40px; }
.calendar-hour-label { font-size: 10px; color: var(--text-muted); }
.calendar-track { flex: 1; position: relative; background: var(--bg-card); border-radius: 8px; overflow: hidden; }
.calendar-grid-line { position: absolute; left: 0; right: 0; height: 1px; background: var(--border); opacity: 0.5; }
.calendar-now { position: absolute; left: 0; right: 0; z-index: 10; display: flex; align-items: center; }
.calendar-now-dot { width: 8px; height: 8px; background: var(--priority); border-radius: 50%; margin-left: -4px; }
.calendar-now-line { flex: 1; height: 2px; background: var(--priority); }
.calendar-meeting { position: absolute; left: 4px; right: 4px; background: var(--bg-hover); border-left: 3px solid var(--text-secondary); border-radius: 4px; padding: 6px 8px; }
.calendar-meeting.now { border-left-color: var(--priority); background: rgba(252, 212, 67, 0.15); }
.calendar-meeting.past { opacity: 0.4; }
.calendar-meeting-time { font-size: 10px; color: var(--text-muted); }
.calendar-meeting-title { font-size: 12px; color: var(--text-primary); }
.message-card { background: var(--bg-card); border-radius: 10px; border-left: 3px solid var(--text-muted); }
.message-card.email { border-left-color: #ea4335; }
.message-card.outlook { border-left-color: #0078d4; }
.message-card-main { display: flex; align-items: center; gap: 12px; padding: 12px 14px; }
.message-card-content { flex: 1; min-width: 0; }
.message-card-from { font-size: 11px; color: var(--text-muted); }
.message-card-subject { font-size: 13px; color: var(--text-primary); }
.message-card-action { padding: 0 14px 12px; }
.message-action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 6px; font-size: 12px; color: var(--text-secondary); cursor: pointer; text-decoration: none; }
.message-action-btn.primary { background: var(--text-primary); color: var(--bg-primary); }
.task-filter-tabs { display: flex; gap: 4px; margin-bottom: 16px; padding: 4px; background: var(--bg-primary); border-radius: 8px; }
.filter-tab { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: transparent; border: none; border-radius: 6px; font-size: 12px; font-family: inherit; color: var(--text-muted); cursor: pointer; }
.filter-tab:hover { color: var(--text-secondary); background: var(--bg-hover); }
.filter-tab.active { background: var(--bg-card); color: var(--text-primary); }
.filter-count { font-size: 10px; padding: 2px 6px; background: var(--bg-hover); border-radius: 4px; color: var(--text-muted); }
.filter-tab.active .filter-count { background: var(--bg-primary); color: var(--text-secondary); }
.sections { display: flex; flex-direction: column; gap: 24px; flex: 1; }
.section { background: var(--bg-secondary); border-radius: 12px; padding: 20px; border: 1px solid var(--border); }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-content { display: flex; flex-direction: column; gap: 8px; }
.task-item { background: var(--bg-card); border-radius: 8px; overflow: visible; border-left: 3px solid transparent; position: relative; }
.task-item.priority { border-left-color: var(--priority); }
.task-main { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
.task-content { flex: 1; min-width: 0; }
.task-title { font-size: 14px; color: var(--text-primary); margin-bottom: 4px; }
.task-subtitle { font-size: 12px; color: var(--text-muted); }
.message-item { background: var(--bg-card); border-radius: 8px; overflow: hidden; border-left: 3px solid var(--text-muted); }
.message-item.email { border-left-color: #ea4335; }
.message-item.slack { border-left-color: #4a154b; }
.message-main { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
.message-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: var(--bg-primary); }
.message-content { flex: 1; }
.app-shortcuts { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: auto; padding: 32px 0 16px; }
.app-shortcut { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-muted); text-decoration: none; }
  `
  const style = document.createElement('style')
  style.id = 'critical-css-fix'
  style.textContent = css
  document.head.appendChild(style)
})()

// n8n Webhook URL for fetching real data
const N8N_WEBHOOK_URL = 'https://doju.app.n8n.cloud/webhook/daily-agenda'

interface AgendaItem {
  id: string
  type: 'task' | 'calendar' | 'email' | 'slack' | 'outlook'
  title: string
  subtitle: string
  description?: string
  time?: string
  endTime?: string
  duration?: string
  meetingLink?: string
  priority?: 'urgent' | 'today' | 'normal'
  isPriority?: boolean
  status?: 'pending' | 'in-progress' | 'due-today' | 'complete' | 'ignored'
  aiSummary?: string
  link?: string
  source?: string
  dueDate?: string // YYYY-MM-DD format
  calendarColor?: string // Google Calendar event color
  eventDate?: string // YYYY-MM-DD format for the event date
  completed?: boolean // Whether task is completed in source system
}

// LocalStorage keys
const STORAGE_KEYS = {
  completedIds: 'doju-completed-ids',
  dismissedIds: 'doju-dismissed-ids',
  taskPriorities: 'doju-task-priorities',
  taskStatuses: 'doju-task-statuses',
  meetingNotes: 'doju-meeting-notes',
  customTasks: 'doju-custom-tasks',
  taskOrder: 'doju-task-order'
}

// Helper to load from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

// Helper to save to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

// n8n Webhook Response Types
interface N8nWebhookResponse {
  generated_at: string
  date: string
  summary: {
    gmail_emails: number
    outlook_emails: number
    calendar_events: number
    slack_messages: number
    asana_tasks: number
    notion_pages: number
    stripe_charges: number
  }
  calendar_events: Array<{
    type: string
    source: string
    id: string
    title: string
    description: string
    start: string
    end: string
    location: string
    meetLink: string
    colorId?: string
    backgroundColor?: string
  }>
  emails: {
    gmail: Array<{
      type: string
      source: string
      id: string
      subject: string
      from: string
      date: string
      snippet: string
      isUnread: boolean
    }>
    outlook: Array<{
      type: string
      source: string
      id: string
      subject: string
      from: string
      date: string
      snippet: string
      isUnread: boolean
    }>
  }
  messages: {
    slack: Array<{
      type: string
      source: string
      id: string
      text: string
      user: string
      channel: string
      timestamp: string
    }>
  }
  tasks: {
    asana: Array<{
      type: string
      source: string
      id: string
      name: string
      due_on: string | null
      completed: boolean
      project: string
      notes: string
    }>
  }
  pages: {
    notion: Array<{
      type: string
      source: string
      id: string
      title: string
      url: string
      last_edited: string
    }>
  }
  finance: {
    stripe: Array<{
      type: string
      source: string
      id: string
      amount: string
      currency: string
      status: string
      description: string
      created: string
    }>
    total: string
  }
}

// Helper to strip HTML tags from text
const stripHtml = (html: string): string => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Helper to extract meeting link from description if not in meetLink field
const extractMeetingLink = (event: { description: string; location: string; meetLink: string }): string => {
  if (event.meetLink) return event.meetLink
  if (event.location && (event.location.includes('zoom.us') || event.location.includes('meet.google'))) {
    return event.location
  }
  // Try to extract from description
  const urlMatch = event.description?.match(/https:\/\/(us\d+web\.)?zoom\.us\/j\/[^\s<"]+|https:\/\/meet\.google\.com\/[^\s<"]+/)
  return urlMatch ? urlMatch[0] : ''
}

// Google Calendar color mapping (colorId to hex)
const GOOGLE_CALENDAR_COLORS: Record<string, string> = {
  '1': '#7986cb',  // Lavender
  '2': '#33b679',  // Sage
  '3': '#8e24aa',  // Grape
  '4': '#e67c73',  // Flamingo
  '5': '#f6bf26',  // Banana
  '6': '#f4511e',  // Tangerine
  '7': '#039be5',  // Peacock
  '8': '#616161',  // Graphite
  '9': '#3f51b5',  // Blueberry
  '10': '#0b8043', // Basil
  '11': '#d50000', // Tomato
}

// Transform n8n webhook response to app data structure
const transformWebhookData = (data: N8nWebhookResponse) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = format(today, 'yyyy-MM-dd')

  // Transform ALL calendar events (not just today)
  const calendarEventsData = data.calendar_events || []
  const allCalendarEvents: AgendaItem[] = calendarEventsData.map(event => {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)
    const eventDateStr = event.start.split('T')[0]
    const durationMs = endDate.getTime() - startDate.getTime()
    const durationMins = Math.round(durationMs / 60000)
    const durationStr = durationMins >= 60
      ? `${Math.floor(durationMins / 60)}h${durationMins % 60 > 0 ? ` ${durationMins % 60}m` : ''}`
      : `${durationMins}m`

    // Clean up description - strip HTML
    const cleanDescription = stripHtml(event.description)
    const meetingLink = extractMeetingLink(event)

    // Get color from colorId or backgroundColor
    const calendarColor = event.backgroundColor ||
      (event.colorId ? GOOGLE_CALENDAR_COLORS[event.colorId] : undefined)

    return {
      id: event.id,
      type: 'calendar' as const,
      title: event.title,
      subtitle: event.location || (cleanDescription.length > 60 ? cleanDescription.substring(0, 60) + '...' : cleanDescription) || '',
      description: cleanDescription,
      time: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      duration: durationStr,
      meetingLink: meetingLink,
      source: 'google_calendar',
      calendarColor: calendarColor,
      eventDate: eventDateStr
    }
  })

  // Sort by date then time
  const sortedEvents = allCalendarEvents.sort((a, b) => {
    const dateA = a.eventDate || ''
    const dateB = b.eventDate || ''
    if (dateA !== dateB) return dateA.localeCompare(dateB)
    const timeA = a.time || '00:00'
    const timeB = b.time || '00:00'
    return timeA.localeCompare(timeB)
  })

  // Filter today's events for the main timeline
  const calendarEvents = sortedEvents.filter(e => e.eventDate === todayStr)

  // Transform Asana tasks - with null safety
  const asanaTasks = data.tasks?.asana || []
  console.log('Asana tasks from webhook:', asanaTasks.length, asanaTasks)

  const tasks: AgendaItem[] = asanaTasks.map(task => {
    const todayFormatted = format(today, 'yyyy-MM-dd')
    const isToday = task.due_on === todayFormatted
    const isPastDue = task.due_on ? new Date(task.due_on) < today : false

    return {
      id: task.id,
      type: 'task' as const,
      title: task.name,
      subtitle: task.project ? `${task.project}${task.due_on ? ` • Due ${task.due_on}` : ''}` : (task.due_on ? `Due ${task.due_on}` : ''),
      description: task.notes,
      priority: isPastDue ? 'urgent' : (isToday ? 'today' : 'normal'),
      isPriority: isPastDue || isToday,
      status: task.completed ? 'complete' : (isToday ? 'due-today' : 'pending'),
      source: 'asana',
      dueDate: task.due_on || undefined
    }
  })

  // Transform Gmail emails - use snippet as title if subject is missing
  const gmailEmails = data.emails?.gmail || []
  const gmailMessages: AgendaItem[] = gmailEmails.map(email => {
    const hasSubject = email.subject && email.subject !== 'No Subject'
    const hasFrom = email.from && email.from !== 'Unknown'
    const snippetPreview = email.snippet ? email.snippet.substring(0, 80) + (email.snippet.length > 80 ? '...' : '') : ''

    return {
      id: email.id,
      type: 'email' as const,
      title: hasSubject ? email.subject : snippetPreview || 'No Subject',
      subtitle: hasFrom ? `From ${email.from}` : (snippetPreview && hasSubject ? snippetPreview : 'From Unknown'),
      description: email.snippet,
      priority: email.isUnread ? 'today' : 'normal',
      isPriority: email.isUnread,
      source: 'gmail'
    }
  })

  // Transform Outlook emails
  const outlookEmails = data.emails?.outlook || []
  const outlookMessages: AgendaItem[] = outlookEmails.map(email => ({
    id: email.id,
    type: 'outlook' as const,
    title: email.subject,
    subtitle: `From ${email.from}`,
    description: email.snippet,
    priority: email.isUnread ? 'today' : 'normal',
    isPriority: email.isUnread,
    source: 'outlook'
  }))

  // Transform Slack messages
  const slackMsgs = data.messages?.slack || []
  const slackMessages: AgendaItem[] = slackMsgs.map(msg => ({
    id: msg.id,
    type: 'slack' as const,
    title: msg.text ? msg.text.substring(0, 100) + (msg.text.length > 100 ? '...' : '') : '',
    subtitle: `${msg.user || 'Unknown'} in #${msg.channel || 'general'}`,
    description: msg.text || '',
    source: 'slack'
  }))

  // Combine all messages
  const messages: AgendaItem[] = [...gmailMessages, ...outlookMessages, ...slackMessages]

  // Build week events - distribute all events to their respective days
  const weekEvents: DayEvents[] = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i)
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayEvents = sortedEvents.filter(e => e.eventDate === dayStr)
    return { date: day, events: dayEvents }
  })

  return {
    tasks,
    todayMeetings: calendarEvents,
    weekEvents,
    messages,
    summary: data.summary,
    finance: data.finance
  }
}

interface DayEvents {
  date: Date
  events: AgendaItem[]
}

interface WeatherData {
  temp: number
  condition: string
  location: string
}

const getGreeting = (_hour: number, name: string, dayOfYear: number) => {
  // Conversational greetings that rotate daily
  const greetings = [
    `Here's what's on today, ${name}`,
    `Couple things to cover, ${name}`,
    `${name}, it's a good one today`,
    `A few tasks for you, ${name}`,
    `Great day for it, ${name}`,
    `Let's get into it, ${name}`,
    `${name}, here's your day`,
    `Ready when you are, ${name}`,
    `${name}, let's make it count`,
    `Here's the rundown, ${name}`,
  ]

  // Use day of year to pick a greeting (rotates daily)
  const greetingIndex = dayOfYear % greetings.length
  return greetings[greetingIndex]
}

// Parse natural language input
const parseNaturalLanguage = (input: string): { title: string; date?: Date; time?: string; priority?: boolean } => {
  const now = new Date()
  let title = input
  let date: Date | undefined
  let time: string | undefined
  let priority = false

  if (input.includes('!') || input.toLowerCase().includes('urgent') || input.toLowerCase().includes('important')) {
    priority = true
    title = title.replace(/!/g, '').replace(/urgent/gi, '').replace(/important/gi, '').trim()
  }

  if (input.toLowerCase().includes('tomorrow')) {
    date = addDays(now, 1)
    title = title.replace(/tomorrow/gi, '').trim()
  }

  if (input.toLowerCase().includes('today')) {
    date = now
    title = title.replace(/today/gi, '').trim()
  }

  if (input.toLowerCase().includes('next week')) {
    date = addWeeks(now, 1)
    title = title.replace(/next week/gi, '').trim()
  }

  const timeMatch = input.match(/at (\d{1,2})(:\d{2})?\s*(am|pm)?/i)
  if (timeMatch) {
    let hour = parseInt(timeMatch[1])
    const minutes = timeMatch[2] ? timeMatch[2].slice(1) : '00'
    const ampm = timeMatch[3]?.toLowerCase()

    if (ampm === 'pm' && hour < 12) hour += 12
    if (ampm === 'am' && hour === 12) hour = 0

    time = `${hour.toString().padStart(2, '0')}:${minutes}`
    title = title.replace(/at \d{1,2}(:\d{2})?\s*(am|pm)?/gi, '').trim()
  }

  title = title.replace(/^(add|create|new|task|remind me to)\s+/gi, '').trim()

  return { title, date, time, priority }
}

// Generate conversational AI summary
const generateAISummary = (
  tasks: AgendaItem[],
  meetings: AgendaItem[],
  messages: AgendaItem[],
  completedCount: number,
  hour: number,
  name: string,
  totalTasks: number
) => {
  const urgentTasks = tasks.filter(t => t.isPriority || t.status === 'due-today')
  const emailMessages = messages.filter(m => m.type === 'email' || m.type === 'outlook')
  const upcomingMeetings = meetings.filter(m => {
    if (!m.time) return false
    const [h] = m.time.split(':').map(Number)
    return h >= hour
  })

  // Early morning (before 9am)
  if (hour < 9) {
    let summary = `Good morning, ${name}! `
    if (meetings.length > 0) {
      summary += `Your first meeting is at ${meetings[0].time} - ${meetings[0].title}. `
    }
    if (urgentTasks.length > 0) {
      summary += `You have ${urgentTasks.length} priority task${urgentTasks.length > 1 ? 's' : ''} to tackle today. `
    }
    if (emailMessages.length > 0) {
      summary += `${emailMessages.length} email${emailMessages.length > 1 ? 's' : ''} waiting for you.`
    }
    return summary || `Good morning, ${name}! Let's have a great day.`
  }

  // Morning (9am-12pm)
  if (hour < 12) {
    let summary = ''
    if (completedCount > 0) {
      summary = `Nice start! ${completedCount} item${completedCount > 1 ? 's' : ''} done. `
    }
    if (upcomingMeetings.length > 0) {
      summary += `${upcomingMeetings.length} meeting${upcomingMeetings.length > 1 ? 's' : ''} coming up. `
    }
    if (urgentTasks.length > 0) {
      summary += `Focus on ${urgentTasks[0].title}.`
    }
    return summary || "Morning's looking clear - great time for deep work."
  }

  // Afternoon (12pm-5pm)
  if (hour < 17) {
    const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
    let summary = ''
    if (progressPercent >= 75) {
      summary = `Crushing it! ${progressPercent}% of your tasks done. `
    } else if (progressPercent >= 50) {
      summary = `Good momentum - halfway through your tasks. `
    } else if (completedCount > 0) {
      summary = `${completedCount} down, ${totalTasks - completedCount} to go. `
    }
    if (upcomingMeetings.length > 0) {
      summary += `${upcomingMeetings.length} more meeting${upcomingMeetings.length > 1 ? 's' : ''} today.`
    }
    return summary || "Afternoon's looking good!"
  }

  // Evening (after 5pm)
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  if (progressPercent >= 80) {
    return `Fantastic day! You completed ${completedCount} task${completedCount > 1 ? 's' : ''}. Time to wind down!`
  } else if (completedCount > 0) {
    return `Solid effort today - ${completedCount} task${completedCount > 1 ? 's' : ''} completed. Rest up!`
  }
  return "Day's winding down. See you tomorrow!"
}

// Demo data
const generateDemoData = () => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  const tasks: AgendaItem[] = [
    { id: 't1', type: 'task', title: 'Orecast Brand Delivery', subtitle: 'Ready to send to client', priority: 'urgent', isPriority: true, status: 'due-today', aiSummary: 'Final assets approved. Client expecting delivery by EOD.', link: '#' },
    { id: 't2', type: 'task', title: 'SCHNELL ENX Website', subtitle: 'Review needed before handoff', priority: 'today', isPriority: true, status: 'in-progress', aiSummary: 'Dev team finished implementation. Needs design QA.', link: '#' },
    { id: 't3', type: 'task', title: 'Magnetic Brand Guidelines', subtitle: 'Due Wednesday', priority: 'normal', isPriority: false, status: 'pending', link: '#' },
    { id: 't4', type: 'task', title: 'Late Saints Packaging', subtitle: 'Due Friday', priority: 'normal', isPriority: false, status: 'in-progress', link: '#' },
    { id: 't5', type: 'task', title: 'Behavoya App Screens', subtitle: 'In progress', priority: 'normal', isPriority: false, status: 'pending', link: '#' }
  ]

  const todayMeetings: AgendaItem[] = [
    { id: 'c1', type: 'calendar', title: 'Design Review - Behavoya', subtitle: 'With Sarah & Mike', time: '10:00', endTime: '11:00', duration: '1h', meetingLink: 'https://meet.google.com/abc-defg-hij' },
    { id: 'c2', type: 'calendar', title: 'Client Call - Magnetic', subtitle: 'Brand presentation', time: '14:00', endTime: '15:30', duration: '1h 30m', meetingLink: 'https://zoom.us/j/123456789' },
    { id: 'c3', type: 'calendar', title: 'Team Standup', subtitle: 'Weekly sync', time: '16:30', endTime: '17:00', duration: '30m', meetingLink: 'https://meet.google.com/xyz-abcd-efg' }
  ]

  const tomorrowMeetings: AgendaItem[] = [
    { id: 'c4', type: 'calendar', title: 'Orecast Handoff Call', subtitle: 'Final delivery meeting', time: '09:00', endTime: '10:00', duration: '1h' },
    { id: 'c5', type: 'calendar', title: 'New Client Intro - Apex', subtitle: 'Discovery session', time: '11:00', endTime: '12:00', duration: '1h' }
  ]

  const weekEvents: DayEvents[] = [
    { date: today, events: todayMeetings },
    { date: tomorrow, events: tomorrowMeetings },
    { date: addDays(today, 2), events: [{ id: 'c8', type: 'calendar', title: 'Portfolio Review', subtitle: 'Team feedback', time: '10:00', endTime: '11:00', duration: '1h' }]},
    { date: addDays(today, 3), events: []},
    { date: addDays(today, 4), events: [{ id: 'c11', type: 'calendar', title: 'Week Retrospective', subtitle: 'Team review', time: '16:00', endTime: '17:00', duration: '1h' }]},
    { date: addDays(today, 5), events: [] },
    { date: addDays(today, 6), events: [] }
  ]

  const messages: AgendaItem[] = [
    { id: 'm1', type: 'email', title: 'Re: Invoice #1042', subtitle: 'From accounts@schnellenx.com', description: 'Hi Oliver, could you please send through the updated invoice?', priority: 'today', isPriority: false },
    { id: 'm2', type: 'slack', title: 'Sarah in #design', subtitle: 'Can we push Behavoya to Friday?', description: 'Hey! The client asked for extra revisions.', priority: 'normal', isPriority: false },
    { id: 'm3', type: 'email', title: 'New Project Inquiry', subtitle: 'From hello@apexstudios.com', description: 'We found your portfolio and love your work.', priority: 'normal', isPriority: false }
  ]

  return { tasks, todayMeetings, weekEvents, messages }
}

// Doju Logo Component
// Integration status types
interface IntegrationStatus {
  id: string
  name: string
  icon: React.ReactNode
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  color: string
}

// Integrations Panel - shows connection status for all services
const IntegrationsPanel = () => {
  const [expanded, setExpanded] = useState(false)

  // In a real app, these would come from actual API connection status
  const integrations: IntegrationStatus[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
      ),
      status: 'connected',
      lastSync: '2 min ago',
      color: '#ea4335'
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75v2.65h.9q.44 0 .75.3.3.31.3.75V8.1h-5.4v9.85h5.4zm-9.48 0q0-.92-.26-1.61-.26-.69-.74-1.15-.48-.46-1.14-.7-.65-.25-1.4-.25-.76 0-1.42.26-.65.26-1.13.74-.48.49-.76 1.18-.28.7-.28 1.55 0 .88.27 1.57.27.69.75 1.16.48.47 1.14.71.65.24 1.42.24.78 0 1.44-.26.66-.27 1.14-.75.48-.49.74-1.17.27-.68.27-1.52zM24 6h-.9v-.55q0-.44-.3-.75-.31-.3-.75-.3H8.55q-.44 0-.75.3-.3.31-.3.75V6H6V3q0-.13.1-.23.1-.1.23-.1h16.33q.14 0 .24.1.1.1.1.23z"/>
        </svg>
      ),
      status: 'connected',
      lastSync: '5 min ago',
      color: '#0078d4'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
        </svg>
      ),
      status: 'connected',
      lastSync: '1 min ago',
      color: '#4a154b'
    },
    {
      id: 'asana',
      name: 'Asana',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.78 12.653c-2.187 0-3.96 1.773-3.96 3.96s1.773 3.96 3.96 3.96 3.96-1.773 3.96-3.96-1.773-3.96-3.96-3.96zm-13.56 0c-2.187 0-3.96 1.773-3.96 3.96s1.773 3.96 3.96 3.96 3.96-1.773 3.96-3.96-1.773-3.96-3.96-3.96zM12 3.427c-2.187 0-3.96 1.773-3.96 3.96s1.773 3.96 3.96 3.96 3.96-1.773 3.96-3.96-1.773-3.96-3.96-3.96z"/>
        </svg>
      ),
      status: 'connected',
      lastSync: '3 min ago',
      color: '#f06a6a'
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.934-.56.934-1.166V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.046-.748.326-.748.933zm14.337.745c.093.42 0 .84-.42.887l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.953l1.448.327s0 .84-1.168.84l-3.222.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.513.28-.886.747-.933zM2.591 1.247L16.02.16c1.681-.14 2.1.093 2.802.607l3.876 2.753c.466.326.606.42.606 1.027v15.214c0 .98-.373 1.54-1.681 1.633l-15.455.94c-.98.046-1.448-.094-1.962-.747L1.517 18.56c-.467-.653-.7-1.166-.7-1.82V2.693c0-.793.373-1.4 1.774-1.446z"/>
        </svg>
      ),
      status: 'disconnected',
      color: '#000000'
    },
    {
      id: 'gcal',
      name: 'Google Calendar',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15c0 .825.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zm0 16.5h-15V8.25h15v11.25zM7.5 10.5h3v3h-3zm4.5 0h3v3h-3zm4.5 0h3v3h-3z"/>
        </svg>
      ),
      status: 'connected',
      lastSync: '1 min ago',
      color: '#4285f4'
    }
  ]

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const totalCount = integrations.length

  const getStatusIcon = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={12} className="status-icon connected" />
      case 'error':
        return <AlertCircle size={12} className="status-icon error" />
      default:
        return <AlertCircle size={12} className="status-icon disconnected" />
    }
  }

  return (
    <div className={`integrations-panel ${expanded ? 'expanded' : ''}`}>
      <button className="integrations-header" onClick={() => setExpanded(!expanded)}>
        <div className="integrations-header-left">
          <Link2 size={14} />
          <span className="integrations-title">Integrations</span>
          <span className="integrations-count">{connectedCount}/{totalCount} connected</span>
        </div>
        <ChevronDown size={16} className={`integrations-chevron ${expanded ? 'rotated' : ''}`} />
      </button>

      {expanded && (
        <div className="integrations-list">
          {integrations.map(integration => (
            <div key={integration.id} className={`integration-item ${integration.status}`}>
              <div className="integration-icon" style={{ color: integration.color }}>
                {integration.icon}
              </div>
              <div className="integration-info">
                <span className="integration-name">{integration.name}</span>
                {integration.lastSync && (
                  <span className="integration-sync">Synced {integration.lastSync}</span>
                )}
                {integration.status === 'disconnected' && (
                  <span className="integration-sync disconnected">Not connected</span>
                )}
              </div>
              <div className="integration-status">
                {getStatusIcon(integration.status)}
              </div>
              {integration.status === 'disconnected' && (
                <button className="integration-connect-btn">
                  Connect
                </button>
              )}
              {integration.status === 'connected' && (
                <button className="integration-settings-btn">
                  <Settings size={12} />
                </button>
              )}
            </div>
          ))}
          <div className="integrations-footer">
            <a href="https://doju.ai/integrations" target="_blank" rel="noopener noreferrer" className="add-integration-btn">
              <Plus size={14} />
              <span>Add Integration</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

const DojuLogo = ({ dark }: { dark: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 382.87 382.87" fill={dark ? '#ffffff' : '#141414'}>
    <rect x="151.7" y="7.91" width="79.46" height="79.46" rx="8.06" ry="8.06"/>
    <rect x="151.7" y="295.5" width="79.46" height="79.46" rx="8.06" ry="8.06"/>
    <rect x="7.91" y="151.7" width="79.46" height="79.46" rx="8.06" ry="8.06"/>
    <rect x="295.5" y="151.7" width="79.46" height="79.46" rx="8.06" ry="8.06"/>
  </svg>
)

// AI Reply Generator - analyzes full email content for context-aware replies
// Helper to pick random item from array
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const generateAIReply = (item: AgendaItem): string => {
  const content = `${item.title} ${item.description || ''}`.toLowerCase()
  const senderMatch = item.subtitle?.match(/From (.+)/i)
  const senderName = senderMatch ? senderMatch[1].split('@')[0].split(' ')[0] : ''

  // Varied greetings
  const greetings = senderName && senderName !== 'Unknown'
    ? [`Hi ${senderName}!`, `Hey ${senderName},`, `Hello ${senderName},`, `Hi ${senderName},`, `Good to hear from you, ${senderName}!`]
    : ['Hi there!', 'Hello!', 'Hey,', 'Hi,', 'Good to hear from you!']
  const greeting = pickRandom(greetings)

  // Varied sign-offs
  const signOffs = [
    'Best,\nOliver',
    'Cheers,\nOliver',
    'Thanks,\nOliver',
    'Speak soon,\nOliver',
    'All the best,\nOliver',
    'Looking forward to it,\nOliver',
    'Warmly,\nOliver'
  ]
  const signOff = pickRandom(signOffs)

  // Time-based context
  const hour = new Date().getHours()
  const timeContext = hour < 12 ? 'this morning' : hour < 17 ? 'this afternoon' : 'this evening'

  // Invoice/Payment related
  if (content.includes('invoice') || content.includes('payment') || content.includes('receipt')) {
    if (content.includes('overdue') || content.includes('reminder')) {
      const responses = [
        `${greeting}\n\nSo sorry for the delay on this one! I've been juggling a few things but this is definitely top priority now. I'll get this sorted ${timeContext} and send you confirmation as soon as it's done.\n\nReally appreciate your patience here.\n\n${signOff}`,
        `${greeting}\n\nApologies for the hold-up – completely my oversight! I'm processing this right now and you'll have confirmation before end of day. Thanks for the nudge, and sorry again for any inconvenience.\n\n${signOff}`,
        `${greeting}\n\nThanks for the reminder! This slipped through the cracks on my end. I'm sorting it now and will send you the confirmation shortly. Won't happen again!\n\n${signOff}`
      ]
      return pickRandom(responses)
    }
    const responses = [
      `${greeting}\n\nGot it! Thanks for sending this over. I've had a quick look and everything seems in order. I'll get the payment processed within the next 24-48 hours and drop you a note once it's done.\n\nLet me know if you need anything else in the meantime!\n\n${signOff}`,
      `${greeting}\n\nPerfect, thanks for this! I'll review the details ${timeContext} and get everything squared away. You should see the payment come through within a couple of days.\n\nAppreciate you sending this promptly.\n\n${signOff}`,
      `${greeting}\n\nThanks so much for sending this through! I've saved it to my accounting folder and will process it this week. Always appreciate how organized you are with these things!\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Meeting/Schedule related
  if (content.includes('meeting') || content.includes('schedule') || content.includes('call') || content.includes('available')) {
    if (content.includes('reschedule') || content.includes('cancel')) {
      const responses = [
        `${greeting}\n\nAbsolutely no worries at all! Life happens. I'm pretty flexible this week and next, so just let me know what works better for you. Happy to shift things around to make it work.\n\nTake your time finding a slot that suits.\n\n${signOff}`,
        `${greeting}\n\nNo problem whatsoever! I totally understand schedules can be unpredictable. Send me a few alternative times whenever you get a chance and we'll lock something in that works for both of us.\n\n${signOff}`,
        `${greeting}\n\nCompletely understand – these things happen! My calendar is fairly open, so just throw some times my way when you know what works. Looking forward to connecting when it suits.\n\n${signOff}`
      ]
      return pickRandom(responses)
    }
    const responses = [
      `${greeting}\n\nLovely to hear from you! I'd be more than happy to jump on a call. Looking at my calendar, I've got some availability this week – how does Tuesday or Thursday afternoon sound? I'm generally free between 2-5pm but can be flexible if those don't work.\n\nJust let me know what suits and I'll send over a calendar invite.\n\n${signOff}`,
      `${greeting}\n\nGreat idea! I'm keen to connect. This week is looking good for me – I could do Wednesday morning or Friday afternoon? Let me know your preference and I'll block out the time.\n\nAlso happy to do a quick 15-min call or a longer chat, whatever works best for what we need to cover!\n\n${signOff}`,
      `${greeting}\n\nSounds great! Always good to have a proper chat. I've got a few slots free this week – what about Thursday around 3pm, or Friday morning? Either works well on my end.\n\nShoot me your preference and we'll get it booked in!\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Project/Work inquiry
  if (content.includes('project') || content.includes('quote') || content.includes('proposal') || content.includes('work')) {
    const responses = [
      `${greeting}\n\nThis sounds really interesting! I'd love to hear more about what you have in mind. Could you share a bit more detail about the project scope and timeline you're working towards? \n\nI'm always excited to take on new challenges, and a quick discovery call might be useful to make sure I fully understand your vision. I've got some availability this week if that works for you?\n\n${signOff}`,
      `${greeting}\n\nThanks so much for thinking of me! I'm definitely intrigued and would love to learn more. What's the best way to get the full picture – would a quick call work, or would you prefer to share some details over email first?\n\nEither way, I'm excited to explore how I can help bring your ideas to life.\n\n${signOff}`,
      `${greeting}\n\nOh this sounds right up my alley! I'd be really keen to dig into the details and see how I can help. \n\nDo you have a brief or some initial thoughts you could share? And if you're free for a quick chat this week, I find that's often the best way to get aligned on the vision and make sure we're on the same page.\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Question/Help request
  if (content.includes('?') || content.includes('help') || content.includes('question') || content.includes('how')) {
    const responses = [
      `${greeting}\n\nGreat question! Let me dig into this ${timeContext} and I'll get back to you with a proper answer. I want to make sure I give you accurate info rather than a rushed response.\n\nExpect to hear from me within the next day or so – and feel free to nudge me if I go quiet!\n\n${signOff}`,
      `${greeting}\n\nThanks for reaching out! I've made a note to look into this properly and will send you a detailed response once I've gathered all the info. Should have something for you by tomorrow at the latest.\n\nIn the meantime, let me know if anything else comes up!\n\n${signOff}`,
      `${greeting}\n\nAppreciate you asking! This is something I want to give a thoughtful answer to rather than just off the top of my head. Give me a bit of time to put together something comprehensive and I'll get back to you.\n\nHang tight!\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Feedback/Review
  if (content.includes('feedback') || content.includes('review') || content.includes('thoughts')) {
    const responses = [
      `${greeting}\n\nThanks for sharing this with me! I'm looking forward to going through it properly. I'll set aside some time ${timeContext} to give it the attention it deserves and send over my thoughts.\n\nExpect detailed feedback by end of day tomorrow – I'll make sure it's constructive and actionable!\n\n${signOff}`,
      `${greeting}\n\nExcellent, thanks for sending this over! I'll carve out some focused time to review everything thoroughly. You can expect my feedback within the next 24-48 hours – I want to make sure I give you genuinely useful input.\n\nReally appreciate you involving me in this!\n\n${signOff}`,
      `${greeting}\n\nLove that you've sent this my way! I'll give it a proper read-through and put together some detailed thoughts. Always happy to be a sounding board.\n\nI'll aim to have something back to you by tomorrow – looking forward to diving in!\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Follow-up / Checking in
  if (content.includes('following up') || content.includes('checking in') || content.includes('update') || content.includes('status')) {
    const responses = [
      `${greeting}\n\nThanks for checking in! I've actually been meaning to reach out with an update. Things are progressing well – let me pull together a proper status update ${timeContext} and I'll send it your way.\n\nAppreciate you keeping me on track!\n\n${signOff}`,
      `${greeting}\n\nPerfect timing! I was just about to loop back on this. Give me a moment to gather my thoughts and I'll send you a comprehensive update. Should have something to you within the hour.\n\n${signOff}`,
      `${greeting}\n\nGood shout! Thanks for the nudge. I'll put together an update on where everything stands and get it over to you today. Appreciate your patience with me!\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Collaboration / Partnership
  if (content.includes('collaborate') || content.includes('partner') || content.includes('together') || content.includes('opportunity')) {
    const responses = [
      `${greeting}\n\nThis sounds really exciting! I'm always open to interesting collaboration opportunities, and this one definitely has potential. Would love to explore this further – perhaps we could jump on a quick call to discuss?\n\nI'm around this week if that works for you!\n\n${signOff}`,
      `${greeting}\n\nThanks so much for reaching out! I love the sound of this and would be keen to learn more. What did you have in mind in terms of how we'd work together?\n\nHappy to chat through the details whenever suits.\n\n${signOff}`,
      `${greeting}\n\nOoh, this is intriguing! I'm definitely interested in hearing more about what you're thinking. Let's find a time to connect and explore the possibilities – I've got a few ideas already brewing!\n\n${signOff}`
    ]
    return pickRandom(responses)
  }

  // Default - personalized and varied
  const defaultResponses = [
    `${greeting}\n\nThanks so much for getting in touch! I've read through your message and will put together a proper response ${timeContext}. Want to make sure I give this the attention it deserves.\n\nYou'll hear from me soon!\n\n${signOff}`,
    `${greeting}\n\nReally appreciate you reaching out! I'll take some time to review this properly and get back to you with my thoughts. Expect a response within the next day or so.\n\nThanks for your patience!\n\n${signOff}`,
    `${greeting}\n\nLovely to hear from you! I'll give this a thorough read and follow up with you shortly. Always happy to help where I can.\n\nChat soon!\n\n${signOff}`,
    `${greeting}\n\nThanks for your message! I'm on it – will review everything and circle back with you ${timeContext} or first thing tomorrow at the latest.\n\n${signOff}`
  ]
  return pickRandom(defaultResponses)
}

// Status Tag Component
const StatusTag = ({ status, onChange }: { status: string; onChange: (newStatus: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'New Lead', label: 'New Lead' },
    { value: 'Project Start', label: 'Project Start' },
    { value: 'Needs Revision', label: 'Needs Revision' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'due-today', label: 'Due Today' },
    { value: 'complete', label: 'Complete' },
    { value: 'ignored', label: 'Ignored' }
  ]

  const currentStatus = statuses.find(s => s.value === status) || statuses[0]

  return (
    <div className="status-tag-wrapper">
      <button className={`status-tag ${status}`} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}>
        {currentStatus.label}
      </button>
      {isOpen && (
        <div className="status-dropdown">
          {statuses.map(s => (
            <button
              key={s.value}
              className={`status-option ${s.value} ${s.value === status ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onChange(s.value); setIsOpen(false) }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Day Timeline Component - Visual 8am-8pm calendar
// Meeting Card component for expandable meeting details
const MeetingCard = ({ meeting, style, isNow, isPast, isMentoring }: {
  meeting: AgendaItem;
  style: { top: number; height: number };
  isNow: boolean;
  isPast: boolean;
  isMentoring: boolean;
}) => {
  const [expanded, setExpanded] = useState(false)
  // Load notes from localStorage or fall back to description
  const storedNotes = loadFromStorage<Record<string, string>>(STORAGE_KEYS.meetingNotes, {})
  const [notes, setNotes] = useState(storedNotes[meeting.id] || meeting.description || '')
  const displayTitle = meeting.title || meeting.subtitle || 'Untitled Meeting'

  // Save notes to localStorage when they change
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes)
    const allNotes = loadFromStorage<Record<string, string>>(STORAGE_KEYS.meetingNotes, {})
    allNotes[meeting.id] = newNotes
    saveToStorage(STORAGE_KEYS.meetingNotes, allNotes)
  }

  // Modal style with calendar color
  const modalStyle: React.CSSProperties = meeting.calendarColor
    ? { borderLeftColor: meeting.calendarColor }
    : {}

  // Use a portal to render the modal at the document body level
  const modalContent = expanded ? (
    <div className="meeting-modal-overlay" onClick={() => setExpanded(false)}>
      <div className={`meeting-modal ${isMentoring ? 'mentoring' : ''}`} style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="meeting-modal-header">
          <div className="meeting-modal-time">{meeting.time} - {meeting.endTime} · {meeting.duration}</div>
          <button className="meeting-modal-close" onClick={() => setExpanded(false)}>
            <X size={18} />
          </button>
        </div>
        <h3 className="meeting-modal-title">{displayTitle}</h3>

        {meeting.subtitle && meeting.subtitle !== displayTitle && (
          <div className="meeting-modal-subtitle">{meeting.subtitle}</div>
        )}

        {meeting.meetingLink && (
          <a
            href={meeting.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="meeting-join-btn"
          >
            <Video size={14} />
            <span>Join Meeting</span>
          </a>
        )}

        <div className="meeting-notes-section">
          <label className="meeting-notes-label">Notes</label>
          <textarea
            className="meeting-notes-input"
            placeholder="Add notes for this meeting..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
          />
        </div>

        <div className="meeting-modal-actions">
          <button className="meeting-action-btn" onClick={() => setExpanded(false)}>
            <Check size={14} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  ) : null

  // Use calendarColor for the border if available
  const meetingStyle: React.CSSProperties = {
    top: style.top,
    height: style.height,
    ...(meeting.calendarColor && { borderLeftColor: meeting.calendarColor })
  }

  return (
    <>
      <div
        className={`calendar-meeting ${isNow ? 'now' : ''} ${isPast ? 'past' : ''} ${isMentoring ? 'mentoring' : ''}`}
        style={meetingStyle}
        onClick={() => setExpanded(true)}
      >
        <div className="calendar-meeting-time">{meeting.time} · {meeting.duration}</div>
        <div className="calendar-meeting-title">{displayTitle}</div>
        {notes && (
          <div className="calendar-meeting-notes">{notes}</div>
        )}
        {meeting.meetingLink && style.height >= 60 && (
          <a
            href={meeting.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="calendar-join"
            onClick={(e) => e.stopPropagation()}
          >
            <Video size={12} /> Join
          </a>
        )}
      </div>
      {typeof document !== 'undefined' && ReactDOM.createPortal(modalContent, document.body)}
    </>
  )
}

const DayTimeline = ({ meetings }: { meetings: AgendaItem[] }) => {
  const START_HOUR = 8
  const END_HOUR = 20
  const HOUR_HEIGHT = 50 // pixels per hour
  const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT
  const calendarRef = React.useRef<HTMLDivElement>(null)

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Current time position
  const currentTimeOffset = ((currentHour - START_HOUR) * 60 + currentMinute) * (HOUR_HEIGHT / 60)
  const showCurrentTime = currentHour >= START_HOUR && currentHour < END_HOUR

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (showCurrentTime && calendarRef.current) {
      const scrollContainer = calendarRef.current.parentElement
      if (scrollContainer) {
        // Scroll so current time is near the top with some padding
        const scrollTarget = Math.max(0, currentTimeOffset - 60)
        scrollContainer.scrollTop = scrollTarget
      }
    }
  }, [])

  // Hour labels
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
    const hour = START_HOUR + i
    return hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`
  })

  // Calculate meeting position and height
  const getMeetingStyle = (meeting: AgendaItem) => {
    const [startHour, startMin] = (meeting.time || '08:00').split(':').map(Number)
    const [endHour, endMin] = (meeting.endTime || '09:00').split(':').map(Number)

    const startMinutes = (startHour - START_HOUR) * 60 + startMin
    const endMinutes = (endHour - START_HOUR) * 60 + endMin
    const durationMinutes = endMinutes - startMinutes

    const top = startMinutes * (HOUR_HEIGHT / 60)
    const height = Math.max(durationMinutes * (HOUR_HEIGHT / 60), 40) // minimum 40px

    const nowTotal = currentHour * 60 + currentMinute
    const startTotal = startHour * 60 + startMin
    const endTotal = endHour * 60 + endMin
    const isNow = nowTotal >= startTotal && nowTotal < endTotal
    const isPast = nowTotal >= endTotal

    return { top, height, isNow, isPast }
  }

  return (
    <div className="day-calendar">
      <div className="calendar-hours">
        {hours.map((label, i) => (
          <div key={i} className="calendar-hour-label" style={{ height: HOUR_HEIGHT }}>
            {label}
          </div>
        ))}
      </div>
      <div ref={calendarRef} className="calendar-track" style={{ height: TOTAL_HEIGHT }}>
        {/* Hour grid lines */}
        {hours.map((_, i) => (
          <div key={i} className="calendar-grid-line" style={{ top: i * HOUR_HEIGHT }} />
        ))}

        {/* Current time indicator */}
        {showCurrentTime && (
          <div className="calendar-now" style={{ top: currentTimeOffset }}>
            <div className="calendar-now-dot" />
            <div className="calendar-now-line" />
          </div>
        )}

        {/* Meetings */}
        {meetings.map(meeting => {
          const { top, height, isNow, isPast } = getMeetingStyle(meeting)
          const isMentoring = (meeting.title || '').toLowerCase().includes('mentoring')
          return (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              style={{ top, height }}
              isNow={isNow}
              isPast={isPast}
              isMentoring={isMentoring}
            />
          )
        })}

        {/* Empty state overlay */}
        {meetings.length === 0 && (
          <div className="calendar-empty">
            <span>No meetings today</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Smart action recommendation based on email content
// Check if email appears to be from a human (not automated/newsletter/system)
const isHumanEmail = (message: AgendaItem): boolean => {
  const content = `${message.title} ${message.subtitle || ''} ${message.description || ''}`.toLowerCase()
  const sender = (message.subtitle || '').toLowerCase()

  // Automated/system email patterns
  const automatedPatterns = [
    'noreply', 'no-reply', 'donotreply', 'do-not-reply',
    'newsletter', 'notifications', 'alerts', 'updates',
    'marketing', 'promotions', 'automated', 'system',
    'support@', 'info@', 'hello@', 'team@', 'sales@',
    'unsubscribe', 'weekly digest', 'daily digest',
    'verify your', 'confirm your', 'security alert',
    'sign-in', 'new sign-in', 'password reset',
    'invoice', 'receipt', 'payment confirmation',
    'order confirmation', 'shipping notification',
    'subscription', 'renewal', 'expiring'
  ]

  // Check if sender or content matches automated patterns
  for (const pattern of automatedPatterns) {
    if (sender.includes(pattern) || content.includes(pattern)) {
      return false
    }
  }

  // Likely human if it has a question or personal greeting
  if (content.includes('?') || content.includes('hi ') || content.includes('hey ') ||
      content.includes('hello ') || content.includes('dear ')) {
    return true
  }

  // Default to human if no automated patterns found
  return true
}

export const getRecommendedAction = (message: AgendaItem): { action: string; label: string; icon: 'delete' | 'reply' | 'unsubscribe' | 'archive' | 'review' } => {
  const content = `${message.title} ${message.description || ''}`.toLowerCase()

  // Unsubscribe patterns
  if (content.includes('unsubscribe') || content.includes('newsletter') || content.includes('marketing') ||
      content.includes('promotional') || content.includes('weekly digest') || content.includes('daily digest')) {
    return { action: 'unsubscribe', label: 'Unsubscribe', icon: 'unsubscribe' }
  }

  // Delete patterns (spam-like, notifications)
  if (content.includes('verify your') || content.includes('confirm your') || content.includes('security alert') ||
      content.includes('sign-in') || content.includes('new sign-in') || content.includes('access to some of your')) {
    return { action: 'delete', label: 'Delete', icon: 'delete' }
  }

  // Reply patterns (questions, requests, meetings)
  if (content.includes('?') || content.includes('meeting') || content.includes('schedule') ||
      content.includes('call') || content.includes('discuss') || content.includes('available')) {
    return { action: 'reply', label: 'Reply', icon: 'reply' }
  }

  // Review patterns (invoices, payments, reports)
  if (content.includes('invoice') || content.includes('payment') || content.includes('receipt') ||
      content.includes('report') || content.includes('document') || content.includes('review')) {
    return { action: 'review', label: 'Review', icon: 'review' }
  }

  // Default to archive
  return { action: 'archive', label: 'Archive', icon: 'archive' }
}

// Message Group Component - Collapsible group for similar message types
const MessageGroup = ({
  type,
  messages,
  onArchive,
  onDismiss
}: {
  type: 'gmail' | 'outlook' | 'slack'
  messages: AgendaItem[]
  onArchive: (id: string) => void
  onDismiss: (id: string) => void
}) => {
  const [expanded, setExpanded] = useState(false)

  const getIcon = () => {
    if (type === 'gmail') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    )
    if (type === 'outlook') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.229c.101.063.222.094.36.094.14 0 .26-.031.361-.094l6.805-5.222c.087-.056.165-.14.234-.248.07-.108.105-.217.105-.326v-.158c0-.2-.07-.359-.21-.477-.14-.118-.298-.177-.472-.177h-.186l-7.037 5.408-1.01-.775V5.25h8.547c.228 0 .422.078.58.232.158.154.238.348.238.576v1.33zM14.635 6.287v12.19c0 .193-.07.357-.21.495-.14.136-.308.204-.508.204H.717c-.2 0-.368-.068-.507-.204a.674.674 0 0 1-.21-.495V6.287c0-.193.07-.358.21-.494.14-.138.308-.206.507-.206h13.2c.2 0 .368.068.508.206.14.136.21.3.21.494z"/>
      </svg>
    )
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    )
  }

  const getLabel = () => {
    if (type === 'gmail') return 'Gmail'
    if (type === 'outlook') return 'Outlook'
    return 'Slack'
  }

  const getColorClass = () => {
    if (type === 'gmail') return 'email'
    if (type === 'outlook') return 'outlook'
    return 'slack'
  }

  // Get preview of first message
  const firstMessage = messages[0]
  const previewText = firstMessage ? firstMessage.title : ''

  return (
    <div className={`message-group ${getColorClass()} ${expanded ? 'expanded' : ''}`}>
      <div className="message-group-header" onClick={() => setExpanded(!expanded)}>
        <div className="message-group-icon">
          {getIcon()}
        </div>
        <div className="message-group-info">
          <div className="message-group-label">{getLabel()}</div>
          <div className="message-group-preview">
            {expanded ? `${messages.length} message${messages.length > 1 ? 's' : ''}` : previewText}
          </div>
        </div>
        <div className="message-group-meta">
          <span className="message-group-count">{messages.length}</span>
          <ChevronDown className={`message-group-chevron ${expanded ? 'rotated' : ''}`} size={16} />
        </div>
      </div>
      {expanded && (
        <div className="message-group-items">
          {messages.map(msg => (
            <MessageItem
              key={msg.id}
              message={msg}
              onArchive={onArchive}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Message Item Component - Different styling from tasks
const MessageItem = ({ message, onArchive, onDismiss: _onDismiss }: { message: AgendaItem; onArchive: (id: string) => void; onDismiss: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(false)
  const [showAIReply, setShowAIReply] = useState(false)
  const [copied, setCopied] = useState(false)
  const isEmail = message.type === 'email'
  const isOutlook = message.type === 'outlook'
  const isSlack = message.type === 'slack'
  const isAnyEmail = isEmail || isOutlook
  const showAIReplyOption = isAnyEmail && isHumanEmail(message)


  const handleCopyReply = () => {
    navigator.clipboard.writeText(generateAIReply(message))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get icon class based on type
  const getIconClass = () => {
    if (isEmail) return 'email'
    if (isOutlook) return 'outlook'
    return 'slack'
  }

  // Get email URL
  const getEmailUrl = () => {
    return message.source === 'gmail' || message.type === 'email'
      ? `https://mail.google.com/mail/u/0/#inbox/${message.id}`
      : `https://outlook.live.com/mail/0/inbox/id/${message.id}`
  }

  // Toggle expanded state
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className={`message-card ${getIconClass()}`}>
      <div className="message-card-main" onClick={toggleExpanded}>
        <div className="message-card-icon">
          {isEmail ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
          ) : isOutlook ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.229c.101.063.222.094.36.094.14 0 .26-.031.361-.094l6.805-5.222c.087-.056.165-.14.234-.248.07-.108.105-.217.105-.326v-.158c0-.2-.07-.359-.21-.477-.14-.118-.298-.177-.472-.177h-.186l-7.037 5.408-1.01-.775V5.25h8.547c.228 0 .422.078.58.232.158.154.238.348.238.576v1.33zM14.635 6.287v12.19c0 .193-.07.357-.21.495-.14.136-.308.204-.508.204H.717c-.2 0-.368-.068-.507-.204a.674.674 0 0 1-.21-.495V6.287c0-.193.07-.358.21-.494.14-.138.308-.206.507-.206h13.2c.2 0 .368.068.508.206.14.136.21.3.21.494z"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
            </svg>
          )}
        </div>
        <div className="message-card-content">
          <div className="message-card-from">{message.subtitle}</div>
          <div className="message-card-subject">{message.title}</div>
        </div>
        <button
          className="message-quick-read"
          onClick={(e) => { e.stopPropagation(); onArchive(message.id); }}
          title="Mark Read"
        >
          <Check size={14} />
        </button>
        <div className="message-card-expand">
          <ChevronDown className={expanded ? 'rotated' : ''} size={16} />
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="message-card-expanded">
          {message.description && <div className="message-card-body">{message.description}</div>}

          {isAnyEmail && (
            <div className="message-card-actions">
              {showAIReplyOption && (
                <button className="msg-action-btn" onClick={() => setShowAIReply(!showAIReply)}>
                  <Sparkles size={12} />
                  <span>AI Reply</span>
                </button>
              )}
              <a href={getEmailUrl()} target="_blank" rel="noopener noreferrer" className="msg-action-btn">
                <Reply size={12} />
                <span>Reply</span>
              </a>
              <button className="msg-action-btn" onClick={() => onArchive(message.id)}>
                <Archive size={12} />
                <span>Archive</span>
              </button>
              <a href={getEmailUrl()} target="_blank" rel="noopener noreferrer" className="msg-action-btn">
                <ExternalLink size={12} />
                <span>Unsubscribe</span>
              </a>
            </div>
          )}

          {isSlack && (
            <div className="message-card-actions">
              <button className="msg-action-btn"><Reply size={12} /><span>Reply</span></button>
              <button className="msg-action-btn" onClick={() => onArchive(message.id)}><Archive size={12} /><span>Mark Read</span></button>
            </div>
          )}

          {isAnyEmail && showAIReply && (
            <div className="ai-reply-section">
              <div className="ai-reply-header"><Sparkles size={12} /><span>Suggested Reply</span></div>
              <div className="ai-reply-content">{generateAIReply(message)}</div>
              <div className="ai-reply-actions">
                <button className="ai-reply-btn" onClick={handleCopyReply}><Copy size={10} /><span>{copied ? 'Copied!' : 'Copy'}</span></button>
                <a href={getEmailUrl()} className="ai-reply-btn primary" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={10} /><span>Reply in {message.source === 'gmail' || message.type === 'email' ? 'Gmail' : 'Outlook'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Task Item Component
interface TaskItemProps {
  item: AgendaItem
  onComplete: (id: string) => void
  onDismiss: (id: string) => void
  onTogglePriority: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onDragStart?: (e: React.DragEvent, id: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, id: string) => void
  isDragging?: boolean
  minimal?: boolean
}

const TaskItem = ({ item, onComplete, onDismiss, onTogglePriority, onStatusChange, onDragStart, onDragOver, onDrop, isDragging, minimal }: TaskItemProps) => {
  const [expanded, setExpanded] = useState(false)
  const [showAIReply, setShowAIReply] = useState(false)
  const [copied, setCopied] = useState(false)
  const isEmail = item.type === 'email'

  // Calculate due date status
  const getDueDateStatus = () => {
    if (!item.dueDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(item.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: 'overdue', label: `${Math.abs(diffDays)}d overdue`, class: 'overdue' }
    if (diffDays === 0) return { status: 'today', label: 'Due today', class: 'due-today' }
    if (diffDays === 1) return { status: 'tomorrow', label: 'Due tomorrow', class: 'due-soon' }
    if (diffDays <= 7) return { status: 'soon', label: `Due in ${diffDays}d`, class: 'due-soon' }
    return { status: 'later', label: format(dueDate, 'MMM d'), class: '' }
  }

  const dueDateStatus = getDueDateStatus()

  const handleCopyReply = () => {
    navigator.clipboard.writeText(generateAIReply(item))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (minimal) {
    return (
      <div className={`task-item minimal ${item.isPriority ? 'priority' : ''} ${dueDateStatus?.class || ''}`}>
        <div className="task-main">
          <div className="task-content">
            <div className="task-title">{item.title}</div>
            <div className="task-subtitle">
              {dueDateStatus && <span className={`due-badge ${dueDateStatus.class}`}><Clock size={10} />{dueDateStatus.label}</span>}
              {!dueDateStatus && item.subtitle}
            </div>
          </div>
          <button className="action-btn-small complete" onClick={() => onComplete(item.id)} title="Complete">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-item ${item.isPriority ? 'priority' : ''} ${isDragging ? 'dragging' : ''} ${dueDateStatus?.class || ''}`} draggable={!!onDragStart} onDragStart={onDragStart ? (e) => onDragStart(e, item.id) : undefined} onDragOver={onDragOver} onDrop={onDrop ? (e) => onDrop(e, item.id) : undefined}>
      <div className="task-main" onClick={() => setExpanded(!expanded)}>
        {onDragStart && <div className="drag-handle"><GripVertical size={12} /></div>}
        <button
          className={`priority-toggle ${item.isPriority ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onTogglePriority(item.id); }}
          title={item.isPriority ? 'Unpin' : 'Pin as priority'}
        >
          <Pin size={12} fill={item.isPriority ? 'currentColor' : 'none'} />
        </button>
        <div className="task-content">
          <div className="task-title">{item.title}</div>
          <div className="task-subtitle">
            {dueDateStatus && <span className={`due-badge ${dueDateStatus.class}`}><Clock size={10} />{dueDateStatus.label}</span>}
            {item.subtitle && <span>{item.subtitle}</span>}
          </div>
        </div>
        {item.type === 'task' && (
          <StatusTag status={item.status || 'pending'} onChange={(newStatus) => onStatusChange(item.id, newStatus)} />
        )}
        <div className="task-actions">
          <button className="action-btn-small dismiss" onClick={(e) => { e.stopPropagation(); onDismiss(item.id); }} title="Dismiss">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button className="action-btn-small complete" onClick={(e) => { e.stopPropagation(); onComplete(item.id); }} title="Complete">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </button>
        </div>
        <ChevronDown className={`task-chevron ${expanded ? 'rotated' : ''}`} size={14} />
      </div>
      {expanded && (
        <div className="task-expanded">
          {item.description && <div className="task-description">{item.description}</div>}
          {item.aiSummary && <div className="ai-insight"><Sparkles size={12} /><span>{item.aiSummary}</span></div>}
          <div className="quick-actions">
            {isEmail && (
              <>
                <button className="quick-action" onClick={() => setShowAIReply(!showAIReply)}><Sparkles size={10} /><span>AI Reply</span></button>
                <button className="quick-action"><Reply size={10} /><span>Reply</span></button>
                <button className="quick-action" onClick={() => onComplete(item.id)}><Archive size={10} /><span>Archive</span></button>
              </>
            )}
            {item.link && <a href={item.link} className="quick-action" target="_blank" rel="noopener noreferrer"><ExternalLink size={10} /><span>Open</span></a>}
          </div>
          {isEmail && showAIReply && (
            <div className="ai-reply-section">
              <div className="ai-reply-header"><Sparkles size={12} /><span>Suggested Reply</span></div>
              <div className="ai-reply-content">{generateAIReply(item)}</div>
              <div className="ai-reply-actions">
                <button className="ai-reply-btn" onClick={handleCopyReply}><Copy size={10} /><span>{copied ? 'Copied!' : 'Copy'}</span></button>
                <button className="ai-reply-btn primary"><Send size={10} /><span>Send</span></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Week View - starts from today
const WeekView = ({ weekEvents, selectedDay, onSelectDay }: { weekEvents: DayEvents[]; selectedDay: Date | null; onSelectDay: (day: Date) => void }) => {
  const today = new Date()
  const [startOffset, setStartOffset] = useState(0) // 0 = today, 7 = next week, -7 = last week
  const startDate = addDays(today, startOffset)
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
  const getEventsForDay = (day: Date) => weekEvents.find(d => isSameDay(d.date, day))?.events || []
  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  // Categorize events for color coding
  const categorizeEvents = (events: AgendaItem[]) => {
    const meetings = events.filter(e => e.type === 'calendar')
    const hasMentoring = meetings.some(e => (e.title || '').toLowerCase().includes('mentoring'))
    return { total: events.length, meetings: meetings.length, hasMentoring }
  }

  return (
    <div className="week-view">
      <div className="week-header">
        <button className="week-nav" onClick={() => setStartOffset(startOffset - 7)}><ChevronLeft size={14} /></button>
        <span className="week-title">
          {startOffset === 0 ? 'This Week' : startOffset === 7 ? 'Next Week' : startOffset === -7 ? 'Last Week' : format(startDate, 'MMM d')}
          {startOffset !== 0 && startOffset !== 7 && startOffset !== -7 && ` - ${format(addDays(startDate, 6), 'MMM d')}`}
        </span>
        <button className="week-nav" onClick={() => setStartOffset(startOffset + 7)}><ChevronRight size={14} /></button>
      </div>
      <div className="week-days">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const { total } = categorizeEvents(dayEvents)
          const isSelected = selectedDay && isSameDay(day, selectedDay)
          const isTodayDate = isToday(day)
          return (
            <div
              key={day.toISOString()}
              className={`week-day ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''} ${total > 0 ? 'has-events' : ''}`}
              onClick={() => onSelectDay(day)}
            >
              <span className="day-name">{isTodayDate ? 'Today' : format(day, 'EEE')}</span>
              <span className="day-number">{format(day, 'd')}</span>
              {total > 0 && (
                <div className="day-event-indicators">
                  {dayEvents.slice(0, 3).map((event, i) => {
                    const dotStyle: React.CSSProperties = event.calendarColor
                      ? { background: event.calendarColor }
                      : {}
                    return (
                      <div
                        key={i}
                        className="event-dot"
                        style={dotStyle}
                        title={event.title}
                      />
                    )
                  })}
                  {total > 3 && <span className="event-more">+{total - 3}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {selectedDay && (
        <div className="day-events-panel">
          <div className="day-events-header">
            <span>{isToday(selectedDay) ? 'Today' : format(selectedDay, 'EEEE, MMMM d')}</span>
            <span className="event-count">{selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}</span>
          </div>
          {selectedDayEvents.length > 0 ? selectedDayEvents.map((event) => {
            const cardStyle: React.CSSProperties = event.calendarColor
              ? { borderLeftColor: event.calendarColor }
              : {}
            return (
              <div key={event.id} className="week-event-card" style={cardStyle}>
                <div className="week-event-time">{event.time}</div>
                <div className="week-event-details">
                  <div className="week-event-title" style={event.calendarColor ? { color: event.calendarColor } : {}}>
                    {event.title}
                  </div>
                  {event.duration && <div className="week-event-duration">{event.duration}</div>}
                </div>
                {event.meetingLink && (
                  <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="week-event-join">
                    <Video size={12} />
                  </a>
                )}
              </div>
            )
          }) : <div className="no-events">No events scheduled</div>}
        </div>
      )}
    </div>
  )
}

// Progress Bar - Segmented Pills
const ProgressBar = ({ completed, total }: { completed: number; total: number }) => {
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">Today's Progress</span>
        <span className="progress-count">{completed}/{total}</span>
      </div>
      <div className="progress-pills">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-pill ${i < completed ? 'filled' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

// Pomodoro Focus Mode with Circular Timer and Spotify
const PomodoroFocus = ({
  onClose,
  priorityTasks,
  onCompleteTask
}: {
  onClose: () => void
  priorityTasks: AgendaItem[]
  onCompleteTask: (id: string) => void
}) => {
  const [totalSeconds] = useState(25 * 60)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="pomodoro-overlay">
      <div className="pomodoro-container">
        <button className="pomodoro-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Spotify Embed - Above Timer */}
        <div className="spotify-embed">
          <iframe
            src="https://open.spotify.com/embed/playlist/5x6wDudS49fdSqKNsemPVW?utm_source=generator&theme=0"
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: '12px' }}
          />
        </div>

        <div className="pomodoro-timer">
          <svg className="timer-circle" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="none" stroke="var(--border)" strokeWidth="2" />
            <circle
              cx="150" cy="150" r="140" fill="none" stroke="var(--priority)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 150 150)" style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            {Array.from({ length: 60 }, (_, i) => {
              const angle = (i * 6 - 90) * (Math.PI / 180)
              const isMinuteMark = i % 5 === 0
              const innerR = isMinuteMark ? 125 : 130
              const outerR = 138
              const x1 = 150 + innerR * Math.cos(angle)
              const y1 = 150 + innerR * Math.sin(angle)
              const x2 = 150 + outerR * Math.cos(angle)
              const y2 = 150 + outerR * Math.sin(angle)
              const elapsed = totalSeconds - timeLeft
              const elapsedMinutes = elapsed / 60
              const tickMinute = i / 60 * 25
              const isActive = tickMinute <= elapsedMinutes
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isActive ? 'var(--priority)' : 'var(--text-muted)'}
                  strokeWidth={isMinuteMark ? 2 : 1} opacity={isMinuteMark ? 1 : 0.5}
                />
              )
            })}
          </svg>

          <div className="timer-content">
            <span className="timer-label">Elapsed</span>
            <span className="timer-display">
              {Math.floor((totalSeconds - timeLeft) / 60).toString().padStart(2, '0')}:{((totalSeconds - timeLeft) % 60).toString().padStart(2, '0')}
            </span>
            <span className="timer-label remaining">Remaining</span>
            <span className="timer-remaining">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="pomodoro-controls">
          <button className={`pomodoro-play-btn ${isRunning ? 'running' : ''}`} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        {priorityTasks.length > 0 && (
          <div className="pomodoro-tasks">
            <div className="pomodoro-tasks-label">Priority Tasks</div>
            {priorityTasks.map(task => (
              <TaskItem
                key={task.id}
                item={task}
                onComplete={onCompleteTask}
                onDismiss={() => {}}
                onTogglePriority={() => {}}
                onStatusChange={() => {}}
                minimal
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {

  const [userName] = useState('Oliver')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [darkMode, setDarkMode] = useState(true)
  const [showFocusMode, setShowFocusMode] = useState(false)
  const [showWeekView, setShowWeekView] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  // State with localStorage persistence
  const [completedIds, setCompletedIds] = useState<string[]>(() => loadFromStorage(STORAGE_KEYS.completedIds, []))
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => loadFromStorage(STORAGE_KEYS.dismissedIds, []))
  const [taskOrder, setTaskOrder] = useState<string[]>(() => loadFromStorage(STORAGE_KEYS.taskOrder, []))
  const [customTasks, setCustomTasks] = useState<AgendaItem[]>(() => loadFromStorage(STORAGE_KEYS.customTasks, []))
  const [taskPriorities, setTaskPriorities] = useState<Record<string, boolean>>(() => loadFromStorage(STORAGE_KEYS.taskPriorities, {}))
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>(() => loadFromStorage(STORAGE_KEYS.taskStatuses, {}))

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [_lastUpdated, setLastUpdated] = useState(new Date())
  const [newTaskInput, setNewTaskInput] = useState('')
  const [undoHistory, setUndoHistory] = useState<Array<{ type: 'complete' | 'dismiss'; id: string }>>([])
  const [showUndoToast, setShowUndoToast] = useState(false)
  const [taskFilter, setTaskFilter] = useState<'all' | 'ready' | 'complete' | 'deleted' | 'priority'>('all')
  const [groupMessages, setGroupMessages] = useState(true) // Toggle for nested/ungrouped messages
  const [mainView, setMainView] = useState<'calendar' | 'tasks' | 'inbox'>('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Persist state to localStorage when they change
  useEffect(() => { saveToStorage(STORAGE_KEYS.completedIds, completedIds) }, [completedIds])
  useEffect(() => { saveToStorage(STORAGE_KEYS.dismissedIds, dismissedIds) }, [dismissedIds])
  useEffect(() => { saveToStorage(STORAGE_KEYS.taskOrder, taskOrder) }, [taskOrder])
  useEffect(() => { saveToStorage(STORAGE_KEYS.customTasks, customTasks) }, [customTasks])
  useEffect(() => { saveToStorage(STORAGE_KEYS.taskPriorities, taskPriorities) }, [taskPriorities])
  useEffect(() => { saveToStorage(STORAGE_KEYS.taskStatuses, taskStatuses) }, [taskStatuses])


  // Real data from n8n webhook
  const [agendaData, setAgendaData] = useState<{
    tasks: AgendaItem[]
    todayMeetings: AgendaItem[]
    weekEvents: DayEvents[]
    messages: AgendaItem[]
    summary?: N8nWebhookResponse['summary']
    finance?: N8nWebhookResponse['finance']
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [_weather] = useState<WeatherData>({ temp: 22, condition: 'Sunny', location: 'Cape Town' })

  // Fetch data from n8n webhook
  const fetchAgendaData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      const response = await fetch(N8N_WEBHOOK_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const data: N8nWebhookResponse = await response.json()
      console.log('Raw webhook response:', data)
      console.log('Tasks in response:', data.tasks)
      console.log('Summary:', data.summary)
      const transformed = transformWebhookData(data)
      console.log('Transformed data:', transformed)
      setAgendaData(transformed)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching agenda data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      // Fall back to demo data on error
      const demoData = generateDemoData()
      setAgendaData({
        tasks: demoData.tasks,
        todayMeetings: demoData.todayMeetings,
        weekEvents: demoData.weekEvents,
        messages: demoData.messages
      })
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    fetchAgendaData()
  }, [])

  // Use fetched data or empty arrays while loading
  const tasks = agendaData?.tasks || []
  const todayMeetings = agendaData?.todayMeetings || []
  const weekEvents = agendaData?.weekEvents || []
  const messages = agendaData?.messages || []

  const allTasks = [...tasks, ...customTasks]

  useEffect(() => {
    if (taskOrder.length === 0) setTaskOrder(allTasks.map(t => t.id))
  }, [allTasks.length])

  const tasksWithPriority: AgendaItem[] = allTasks.map(t => ({
    ...t,
    isPriority: taskPriorities[t.id] !== undefined ? taskPriorities[t.id] : t.isPriority,
    status: (taskStatuses[t.id] || t.status || 'pending') as AgendaItem['status']
  }))

  // "Ready" = completed in Asana (by team) but not yet completed by you in localhost
  // "Complete" = you clicked tick in localhost (sent to client)
  const readyTasks = tasksWithPriority.filter(t =>
    t.completed === true && !completedIds.includes(t.id) && !dismissedIds.includes(t.id)
  )
  const activeTasks = tasksWithPriority.filter(t =>
    !completedIds.includes(t.id) && !dismissedIds.includes(t.id) && t.status !== 'ignored'
  )
  const completedTasks = tasksWithPriority.filter(t => completedIds.includes(t.id))
  const deletedTasks = tasksWithPriority.filter(t => dismissedIds.includes(t.id) || t.status === 'ignored')
  const activeMessages = messages.filter(m => !completedIds.includes(m.id) && !dismissedIds.includes(m.id))
  const orderedTasks = [...activeTasks].sort((a, b) => taskOrder.indexOf(a.id) - taskOrder.indexOf(b.id))
  const priorityTasks = orderedTasks.filter(t => t.isPriority)

  // Filter tasks based on selected tab
  const getFilteredTasks = () => {
    switch (taskFilter) {
      case 'ready':
        return readyTasks
      case 'complete':
        return completedTasks
      case 'deleted':
        return deletedTasks
      case 'priority':
        return priorityTasks
      default:
        return orderedTasks
    }
  }
  const filteredTasks = getFilteredTasks()
  const totalItems = allTasks.length + messages.length
  const completedCount = completedIds.length + Object.values(taskStatuses).filter(s => s === 'complete').length

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 60000); return () => clearInterval(timer) }, [])
  useEffect(() => { document.body.classList.toggle('light-mode', !darkMode) }, [darkMode])

  // Undo keyboard shortcut (Cmd+Z / Ctrl+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undoHistory])

  const handleComplete = (id: string) => {
    setCompletedIds(prev => [...prev, id])
    setUndoHistory(prev => [...prev, { type: 'complete', id }])
    setShowUndoToast(true)
    setTimeout(() => setShowUndoToast(false), 3000)
  }

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id])
    setUndoHistory(prev => [...prev, { type: 'dismiss', id }])
    setShowUndoToast(true)
    setTimeout(() => setShowUndoToast(false), 3000)
  }

  const handleUndo = () => {
    if (undoHistory.length === 0) return
    const lastAction = undoHistory[undoHistory.length - 1]
    if (lastAction.type === 'complete') {
      setCompletedIds(prev => prev.filter(id => id !== lastAction.id))
    } else {
      setDismissedIds(prev => prev.filter(id => id !== lastAction.id))
    }
    setUndoHistory(prev => prev.slice(0, -1))
    setShowUndoToast(false)
  }
  const handleRefresh = () => { fetchAgendaData() }

  const handleTogglePriority = (id: string) => {
    setTaskPriorities(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !tasksWithPriority.find(t => t.id === id)?.isPriority
    }))
  }

  const handleStatusChange = (id: string, status: string) => {
    setTaskStatuses(prev => ({ ...prev, [id]: status }))
  }

  const handleDragStart = (e: React.DragEvent, id: string) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move' }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    const newOrder = [...taskOrder]
    const draggedIndex = newOrder.indexOf(draggedId)
    const targetIndex = newOrder.indexOf(targetId)
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedId)
    setTaskOrder(newOrder)
    setDraggedId(null)
  }

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return
    const parsed = parseNaturalLanguage(newTaskInput)
    const newTask: AgendaItem = {
      id: `custom-${Date.now()}`,
      type: 'task',
      title: parsed.title,
      subtitle: parsed.date ? format(parsed.date, 'EEEE') : 'No due date',
      time: parsed.time,
      priority: parsed.priority ? 'urgent' : 'normal',
      isPriority: parsed.priority,
      status: 'pending'
    }
    setCustomTasks(prev => [newTask, ...prev])
    setTaskOrder(prev => [newTask.id, ...prev])
    setNewTaskInput('')
  }

  const greeting = getGreeting(currentTime.getHours(), userName, getDayOfYear(currentTime))
  const aiSummary = generateAISummary(activeTasks, todayMeetings, activeMessages, completedCount, currentTime.getHours(), userName, totalItems)

  // Show loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <span>Loading your Daily Doju...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {showFocusMode && (
        <PomodoroFocus
          onClose={() => setShowFocusMode(false)}
          priorityTasks={priorityTasks}
          onCompleteTask={handleComplete}
        />
      )}

      {error && (
        <div className="error-banner">
          <span>⚠️ {error} - Showing cached data</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      <header className="header">
        {/* Logo and brand */}
        <div className="header-brand">
          <DojuLogo dark={darkMode} />
          <span className="brand-name">DOJU DAILY</span>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowFocusMode(true)} title="Focus Mode">
              <Play size={16} />
            </button>
            <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className={`icon-btn ${refreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal date picker */}
        <div className="date-picker-strip">
          {Array.from({ length: 7 }, (_, i) => {
            const date = addDays(subDays(new Date(), 3), i)
            const isSelected = isSameDay(date, selectedDate)
            const isTodayDate = isToday(date)
            return (
              <button
                key={i}
                className={`date-picker-day ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="day-label">{format(date, 'EEE').charAt(0)}</span>
                <span className="day-number">{format(date, 'd')}</span>
              </button>
            )
          })}
        </div>

        {/* Greeting and summary */}
        <div className="summary-card">
          <h1 className="greeting">{greeting}</h1>
          <p className="ai-summary">{aiSummary}</p>
          <p className="summary-subtitle">
            {readyTasks.length > 0 && <span className="summary-stat ready">{readyTasks.length} ready</span>}
            {priorityTasks.length > 0 && <span className="summary-stat priority">{priorityTasks.length} priority</span>}
            {activeMessages.length > 0 && <span className="summary-stat messages">{activeMessages.length} messages</span>}
          </p>
        </div>

        {/* Main navigation tabs */}
        <div className="main-tabs">
          <button
            className={`main-tab ${mainView === 'calendar' ? 'active' : ''}`}
            onClick={() => setMainView('calendar')}
          >
            <Calendar size={16} />
            <span>Calendar</span>
          </button>
          <button
            className={`main-tab ${mainView === 'tasks' ? 'active' : ''}`}
            onClick={() => setMainView('tasks')}
          >
            <CheckCircle size={16} />
            <span>Tasks</span>
            {readyTasks.length > 0 && <span className="tab-badge">{readyTasks.length}</span>}
          </button>
          <button
            className={`main-tab ${mainView === 'inbox' ? 'active' : ''}`}
            onClick={() => setMainView('inbox')}
          >
            <Mail size={16} />
            <span>Inbox</span>
            {activeMessages.length > 0 && <span className="tab-badge">{activeMessages.length}</span>}
          </button>
        </div>
      </header>

      {/* Calendar View */}
      {mainView === 'calendar' && (
        <>
          <div className="view-toggle">
            <button className={`toggle-btn ${!showWeekView ? 'active' : ''}`} onClick={() => setShowWeekView(false)}>Today</button>
            <button className={`toggle-btn ${showWeekView ? 'active' : ''}`} onClick={() => setShowWeekView(true)}>Week</button>
          </div>

          {showWeekView && <WeekView weekEvents={weekEvents} selectedDay={selectedDay} onSelectDay={setSelectedDay} />}

          {!showWeekView && (
            <div className="meetings-timeline">
              <div className="section-label">Today's Schedule</div>
              <DayTimeline meetings={todayMeetings} />
            </div>
          )}
        </>
      )}

      {/* Tasks View */}
      {mainView === 'tasks' && (
        <main className="sections">
          <div className="task-input-section">
            <input
              type="text"
              className="task-input"
              placeholder="Add task... try 'Call Sarah tomorrow at 3pm !'"
              value={newTaskInput}
              onChange={e => setNewTaskInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <button className="task-input-btn" onClick={handleAddTask}>
              <Plus size={18} />
            </button>
          </div>

          <ProgressBar completed={completedCount} total={totalItems} />

          <div className="section">
            <div className="section-header">
              <div className="section-label">Projects & Tasks</div>
              <div className="section-meta"><span className="meta-count">{filteredTasks.length}</span></div>
            </div>
            <div className="task-filter-tabs">
              <button
                className={`filter-tab ${taskFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTaskFilter('all')}
              >
                All
                <span className="filter-count">{orderedTasks.length}</span>
              </button>
              <button
                className={`filter-tab ${taskFilter === 'ready' ? 'active' : ''}`}
                onClick={() => setTaskFilter('ready')}
              >
                Ready
                <span className="filter-count">{readyTasks.length}</span>
              </button>
              <button
                className={`filter-tab ${taskFilter === 'priority' ? 'active' : ''}`}
                onClick={() => setTaskFilter('priority')}
              >
                Priority
                <span className="filter-count">{priorityTasks.length}</span>
              </button>
              <button
                className={`filter-tab ${taskFilter === 'complete' ? 'active' : ''}`}
                onClick={() => setTaskFilter('complete')}
              >
                Sent
                <span className="filter-count">{completedTasks.length}</span>
              </button>
              <button
                className={`filter-tab ${taskFilter === 'deleted' ? 'active' : ''}`}
                onClick={() => setTaskFilter('deleted')}
              >
                Deleted
                <span className="filter-count">{deletedTasks.length}</span>
              </button>
            </div>
            <div className="section-content">
              {filteredTasks.length > 0 ? filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  item={task}
                  onComplete={handleComplete}
                  onDismiss={handleDismiss}
                  onTogglePriority={handleTogglePriority}
                  onStatusChange={handleStatusChange}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={draggedId === task.id}
                />
              )) : <div className="empty-state">No tasks to show</div>}
            </div>
          </div>
        </main>
      )}

      {/* Inbox View */}
      {mainView === 'inbox' && (
        <main className="sections">
          <div className="section messages-section">
            <div className="section-header">
              <div className="section-label">Messages</div>
              <div className="section-meta">
                <span className="meta-count">{activeMessages.length}</span>
                <button
                  className={`group-toggle ${groupMessages ? 'active' : ''}`}
                  onClick={() => setGroupMessages(!groupMessages)}
                  title={groupMessages ? 'Show all messages' : 'Group by source'}
                >
                  {groupMessages ? 'Grouped' : 'All'}
                </button>
              </div>
            </div>
            <div className="section-content">
              {activeMessages.length > 0 ? (
                groupMessages ? (
                  <>
                    {(() => {
                      const gmailMessages = activeMessages.filter(m => m.type === 'email' || m.source === 'gmail')
                      const outlookMessages = activeMessages.filter(m => m.type === 'outlook' || m.source === 'outlook')
                      const slackMessages = activeMessages.filter(m => m.type === 'slack' || m.source === 'slack')
                      return (
                        <>
                          {gmailMessages.length > 0 && (
                            <MessageGroup
                              type="gmail"
                              messages={gmailMessages}
                              onArchive={handleComplete}
                              onDismiss={handleDismiss}
                            />
                          )}
                          {outlookMessages.length > 0 && (
                            <MessageGroup
                              type="outlook"
                              messages={outlookMessages}
                              onArchive={handleComplete}
                              onDismiss={handleDismiss}
                            />
                          )}
                          {slackMessages.length > 0 && (
                            <MessageGroup
                              type="slack"
                              messages={slackMessages}
                              onArchive={handleComplete}
                              onDismiss={handleDismiss}
                            />
                          )}
                        </>
                      )
                    })()}
                  </>
                ) : (
                  activeMessages.map(msg => (
                    <MessageItem
                      key={msg.id}
                      message={msg}
                      onArchive={handleComplete}
                      onDismiss={handleDismiss}
                    />
                  ))
                )
              ) : <div className="empty-state">No messages</div>}
            </div>
          </div>
        </main>
      )}

      {/* Undo Toast */}
      {showUndoToast && (
        <div className="undo-toast">
          <span>Action completed</span>
          <button onClick={handleUndo}>Undo</button>
          <span className="undo-hint">⌘Z</span>
        </div>
      )}

      {/* App Shortcuts */}
      <div className="app-shortcuts">
        <a href="https://app.asana.com" target="_blank" rel="noopener noreferrer" className="app-shortcut" title="Asana">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M18.78 12.653c-2.187 0-3.96 1.773-3.96 3.96s1.773 3.96 3.96 3.96 3.96-1.773 3.96-3.96-1.773-3.96-3.96-3.96zm-13.56 0c-2.187 0-3.96 1.773-3.96 3.96s1.773 3.96 3.96 3.96 3.96-1.773 3.96-3.96-1.773-3.96-3.96-3.96zM12 3.427c-2.187 0-3.96 1.773-3.96 3.96s1.773 3.96 3.96 3.96 3.96-1.773 3.96-3.96-1.773-3.96-3.96-3.96z"/>
          </svg>
        </a>
        <a href="https://notion.so" target="_blank" rel="noopener noreferrer" className="app-shortcut" title="Notion">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.934-.56.934-1.166V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.046-.748.326-.748.933zm14.337.745c.093.42 0 .84-.42.887l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.953l1.448.327s0 .84-1.168.84l-3.222.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.513.28-.886.747-.933zM2.591 1.247L16.02.16c1.681-.14 2.1.093 2.802.607l3.876 2.753c.466.326.606.42.606 1.027v15.214c0 .98-.373 1.54-1.681 1.633l-15.455.94c-.98.046-1.448-.094-1.962-.747L1.517 18.56c-.467-.653-.7-1.166-.7-1.82V2.693c0-.793.373-1.4 1.774-1.446z"/>
          </svg>
        </a>
        <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="app-shortcut" title="Google Calendar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15c0 .825.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zm0 16.5h-15V8.25h15v11.25zM7.5 10.5h3v3h-3zm4.5 0h3v3h-3zm4.5 0h3v3h-3z"/>
          </svg>
        </a>
        <a href="https://slack.com" target="_blank" rel="noopener noreferrer" className="app-shortcut" title="Slack">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
          </svg>
        </a>
        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="app-shortcut" title="Gmail">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
          </svg>
        </a>
        <a href="https://figma.com" target="_blank" rel="noopener noreferrer" className="app-shortcut" title="Figma">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.049-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019 3.019-1.355 3.019-3.019-1.354-3.019-3.019-3.019z"/>
          </svg>
        </a>
      </div>

      {/* Integrations Panel */}
      <IntegrationsPanel />

      <footer className="footer">
        <DojuLogo dark={darkMode} />
      </footer>
    </div>
  )
}

export default App