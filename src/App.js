import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Note = ({ note }) => <li>{note.content}</li>

const App = () => {
  const [notes, setNote] = useState([])
  const [newNote, setNewnote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault()
    console.log(event.target)
    const noteObj = {
      id: notes.length + 1,
      content: newNote,
      date: new Date().toString(),
      important: Math.random() < 0.5
    }
    console.log(noteObj.important)
    setNote(notes.concat(noteObj))
    setNewnote('')
  }

  const handleChange = (event) => {
    console.log(event.target.value)
    setNewnote(event.target.value)
  }

const noteToShow = showAll ? notes : notes.filter(note => note.important === true)

const hook = () => {
  axios
    .get('http://localhost:3001/notes')
    .then(res => {
      console.log('promised fullfilled')
      setNote(res.data)
    })
}

useEffect(hook, [])

// useEffect (() => {
//   console.log('effect')
//   axios
//     .get('http://localhost:3001/notes')
//     .then(res => {
//       console.log('promised fullfilled')
//       setNote(res.data)
//     })
// }, [])

console.log('render', notes.length, 'notes')

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      <ul>
        {noteToShow.map((note) =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          onChange={handleChange}
          value={newNote} />
        <button>Save</button>
      </form>
    </div>
  )
}

export default App