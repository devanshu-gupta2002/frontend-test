import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Footer from './components/footer'
import "./index.css"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])


  const Notification = ({message}) => {
    if (message===null){
      return null
    }
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `The note ${note.content} was already deleted from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n=> n.id !==id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: notes.length + 1,
    }

noteService
    .create(noteObject)
  .then(returnedNote => {
    setNotes(notes.concat(returnedNote))
    setNewNote('')
  })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div> 
      <ul>
        <ul>
          {notesToShow.map(note => 
            <Note 
            key={note.id} 
            note={note}
            toggleImportance={() =>toggleImportanceOf(note.id)} />
          )}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App