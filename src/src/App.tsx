import { useState, useEffect } from 'react'

const API = 'https://sincere-renewal-production-3430.up.railway.app'

type Task = {
  _id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(r => r.json())
      .then(data => { setTasks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const addTask = async () => {
    if (!newTask.trim()) return
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask, status: 'todo' })
    })
    const task = await res.json()
    setTasks([...tasks, task])
    setNewTask('')
  }

  const deleteTask = async (id: string) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(t => t._id !== id))
  }

  const changeStatus = async (id: string, status: Task['status']) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    const updated = await res.json()
    setTasks(tasks.map(t => t._id === id ? updated : t))
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>📋 Task Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Manage your tasks easily</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input value={newTask} onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }} />
        <button onClick={addTask}
          style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>
          + Add
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'todo', 'in-progress', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd', cursor: 'pointer',
              background: filter === f ? '#4f46e5' : '#fff', color: filter === f ? '#fff' : '#333' }}>
            {f}
          </button>
        ))}
      </div>
      {loading && <p style={{ textAlign: 'center', color: '#999' }}>Loading tasks...</p>}
      {filtered.map(task => (
        <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', marginBottom: 10, borderRadius: 10, background: '#f9f9f9', border: '1px solid #eee' }}>
          <span style={{ flex: 1, fontSize: 15 }}>{task.title}</span>
          <select value={task.status} onChange={e => changeStatus(task._id, e.target.value as Task['status'])}
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: task.status === 'done' ? '#d1fae5' : task.status === 'in-progress' ? '#fef3c7' : '#e0e7ff',
            color: task.status === 'done' ? '#065f46' : task.status === 'in-progress' ? '#92400e' : '#3730a3' }}>
            {task.status}
          </span>
          <button onClick={() => deleteTask(task._id)}
            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
      ))}
      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>No tasks found!</p>
      )}
    </div>
  )
}
