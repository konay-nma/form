import React, { useEffect, useState } from 'react'

import noteService from './service/notes';
import '../src/index.css'

const Note = ({ note, toggleImportanceOf }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportanceOf} >{label}</button>
    </li>
  )
}

// to show the error message
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}
 
// inline style bad design but useful in some cases
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewnote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const addNote = (event) => {
    event.preventDefault()
    console.log(event.target)
    const noteObj = {
      //id: notes.length + 1,
      content: newNote,
      date: new Date().toString(),
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObj)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewnote('')
      })

    console.log(noteObj.important)
  }

  const handleChange = (event) => {
    console.log(event.target.value)
    setNewnote(event.target.value)
  }

  const noteToShow = showAll ? notes : notes.filter(note => note.important === true)

  /** // same as below 
   const hook = () => {
      noteService
        .getAll()
        .then(initialNotes => {
          console.log('promised fullfilled')
          setNotes(initialNotes)
        })
    }
  
    useEffect(hook, []) 
   */

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        console.log('promised fullfilled')
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    //const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(note => note.id === id)
    const changeNote = { ...note, important: !note.important }
    noteService
      .update(id, changeNote)
      .then(returnNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnNote))
      })
      .catch(err => {
        setErrorMessage(`Note '${note.content}' was already deleted from server`)
        setNotes(notes.filter(note => note.id !== id))
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
//this is test
  console.log('render', notes.length, 'notes')

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      <ul>
        {noteToShow.map((note) =>
          <Note key={note.id} note={note} toggleImportanceOf={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          onChange={handleChange}
          value={newNote} />
        <button>Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App