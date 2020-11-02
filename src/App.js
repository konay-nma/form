import React, { useEffect, useState } from "react";

import noteService from "./service/notes";
import "../src/index.css";
import Footer from "./components/Footer";
import Note from "./components/Note";
import Notification from "./components/Notification";
import loginService from "./service/login";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewnote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const addNote = (event) => {
    event.preventDefault();
    const noteObj = {
      //id: notes.length + 1,
      content: newNote,
      date: new Date().toString(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteObj).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewnote("");
    });
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    setNewnote(event.target.value);
  };

  const noteToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const toggleImportanceOf = (id) => {
    //const url = `http://localhost:3001/notes/${id}`
    const note = notes.find((note) => note.id === id);
    const changeNote = { ...note, important: !note.important };
    noteService
      .update(id, changeNote)
      .then((returnNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnNote)));
      })
      .catch((err) => {
        setErrorMessage(
          `Note '${note.content}' was already deleted from server`
        );
        setNotes(notes.filter((note) => note.id !== id));
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong Credential");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      console.log("promised fullfilled");
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username{" "}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  };

  const noteForm = () => {
    return (
      <form onSubmit={addNote}>
        <input onChange={handleChange} value={newNote} />
        <button>Save</button>
      </form>
    );
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      { user === null ? 
        loginForm() : 
        <div>
          <p>{user.name}</p>
          {noteForm()}
        </div> }

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "important" : "all"}
      </button>
      <ul>
        {noteToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportanceOf={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
