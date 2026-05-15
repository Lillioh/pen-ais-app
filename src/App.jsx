import React, { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  BarChart3,
  BookOpen,
  Download,
  FileText,
  Grid2X2,
  HelpCircle,
  Link,
  List,
  Menu,
  MoreVertical,
  PenLine,
  Radio,
  Search,
  Settings,
  Share2,
  Wand2
} from 'lucide-react'

import { supabase } from './supabase'
import Auth from './Auth'

const sampleDraft = `In the quiet transition between the analog breath and the digital pulse, there exists a threshold—a space where silicon logic begins to mirror the chaotic elegance of human intuition.`

export default function App() {
  const [session, setSession] = useState(null)
  const [draft, setDraft] = useState(sampleDraft)
  const [selectedTool, setSelectedTool] = useState('refine')
  const [menu, setMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const wordCount = useMemo(
    () => draft.trim().split(/\s+/).filter(Boolean).length,
    [draft]
  )

  const score = useMemo(
    () =>
      Math.min(
        98,
        Math.max(
          72,
          Math.round(
            78 +
              new Set(
                draft.toLowerCase().match(/[a-z]+/g) || []
              ).size / 8
          )
        )
      ),
    [draft]
  )

  if (!session) {
    return <Auth />
  }

  async function runAI() {
    setLoading(true)

    try {
      const res = await fetch(
        'https://hvpucldlltzrachgzpvf.supabase.co/functions/v1/ai-writer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: draft,
            action: selectedTool,
          }),
        }
      )

      const data = await res.json()

      if (data.error) {
        alert(data.error)
        return
      }

      setDraft(data.output)
    } catch (error) {
      console.error(error)
      alert('AI request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? 'show' : ''}`}>
        <div className="brand">
          <h1>PEN-AIs</h1>
          <button onClick={() => setMenu(false)}>×</button>
        </div>

        <div className="suite">
          <PenLine size={20} />
          <div>
            <b>PEN-AIS</b>
            <small>AI Writing Suite</small>
          </div>
        </div>

        <button className="new-btn">+ New Draft</button>

        <Nav icon={<Grid2X2 />} text="Workshop" />
        <Nav icon={<FileText />} text="The Canvas" active />
        <Nav icon={<Archive />} text="Archive" />
        <Nav icon={<BarChart3 />} text="Style Studio" />

        <div className="bottom-nav">
          <Nav icon={<Settings />} text="Settings" />
          <Nav icon={<HelpCircle />} text="Help" />
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile" onClick={() => setMenu(true)}>
            <Menu />
          </button>

          <div className="search">
            <Search size={16} />
            <input placeholder="Search Workshop..." />
          </div>

          <div className="actions">
            <button
              onClick={() => supabase.auth.signOut()}
              className="logout-btn"
            >
              Logout
            </button>

            <Share2 />
            <Download />
            <MoreVertical />

            <button className="publish">Publish</button>

            <div className="avatar" />
          </div>
        </header>

        <div className="workspace">
          <section className="editor">
            <div className="meta">
              <span>PROJECT: OBSIDIAN ECHOES</span>
              <small>Last edited now</small>
            </div>

            <input
              className="title"
              defaultValue="The Obsidian Echo: Navigating the Voids of Digital Consciousness"
            />

            <div className="stats">
              <span>
                <BookOpen size={14} />
                8 min read
              </span>

              <span>
                <FileText size={14} />
                {wordCount} words
              </span>
            </div>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />

            <div className="toolbar">
              <b>B</b>
              <i>I</i>

              <Link size={16} />
              <List size={16} />

              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
              >
                <option value="refine">Refine Selection</option>
                <option value="expand">Expand Insight</option>
                <option value="summarize">Summarize</option>
                <option value="grammar">Grammar Check</option>
                <option value="tone">Rewrite Tone</option>
              </select>

              <button onClick={runAI} disabled={loading}>
                <Wand2 size={16} />
                {loading ? 'Thinking...' : 'Run AI'}
              </button>
            </div>
          </section>

          <aside className="auditor">
            <div className="auditor-title">
              <span>AI Auditor</span>
              <Radio size={18} />
            </div>

            <Metric label="Syntactic Precision" value={score} />
          </aside>
        </div>
      </main>
    </div>
  )
}

function Nav({ icon, text, active }) {
  return (
    <div className={`nav ${active ? 'active' : ''}`}>
      {React.cloneElement(icon, { size: 18 })}
      <span>{text}</span>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <div>
        <span>{label}</span>
        <b>{value}%</b>
      </div>

      <section>
        <i style={{ width: value + '%' }} />
      </section>
    </div>
  )
}