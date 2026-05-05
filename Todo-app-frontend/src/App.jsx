import React, { useState, useEffect } from 'react'; // this statement import the Hook to let React track data.

function App() {
  // state definitions
  //    [value, functionToUpdateValue] = useState(initialValue)
  const [todo, setTodo] = useState(""); // tracks what you are typing in the input field
  const [list, setList] = useState([]); //This holds data from the server,

  // ---FETCH LOGIC FOR BACKEND DATA---
  // this function displays the tasks from the backends as the page loads with the help of useEffect
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setList(data); // updates the "list" state with the data from the server.
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  //Run fetchTasks once when the page first loads
  useEffect(() => {
    fetchTasks();
  }, []);


  // --- LOGIC FUNCTIONS ---

  // Function to add a new task.
  const addTodo = async () => {
    if (todo.trim() !== "") {
      // 1. Send the task to the Backend
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todo }) // Send the text we type
      });

      if (response.ok) {
        // 2. If the server saved it successfully, refresh our list
        fetchTasks(); 
        setTodo(""); // Clear the input
      }
    } else {
      alert("Please enter something to do.");
    }
  };
 
  //fubction to delete a task
 const deleteTodo = async (idToDelete) => {
  await fetch(`http://localhost:5000/api/tasks/${idToDelete}`, {
    method: 'DELETE'
  });
  fetchTasks(); // Refresh the list after deleting
};
 
  // function to toggle the completed status of a task
  const toggleComplete = async (id, currentStatus) => {
    // send a request to the backend to "update" (PATCH)
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      // send the opposite of the current status (if it's true, send false, and vice versa)
      body: JSON.stringify({ completed: !currentStatus })
    });
    fetchTasks(); // Refres the list to show the change
  }
  // the UI(what is shown in the browser.)
  return (
     <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', fontFamily: 'Aria', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ color: '#646cff' }}> ToDo App ⚡</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {/* CONTROLLED INPUT: The value is linked directly to the "todo" state */}
        <input 
          type='text'
          value={todo}
          onChange={(e) => setTodo(e.target.value)} // updates the "todo" state as you type.
          placeholder="what's the plan, bro?"
          style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={addTodo}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '5px' }} 
        >
          Add Task
        </button>
      </div>

    {/* RENDERING THE LIST: We loop through the "list" array and turn each item into a <li> */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {list.map((item) => (
  <li key={item.id} style={{
    display: 'flex',
    justifyContent: 'space-between', // Pushes the Delete button to the far right
    padding: '10px',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
    backgroundColor: item.completed ? '#f0fff4' : 'transparent'
  }}>
    {/* This div keeps the Button and Text together on the left */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
      <button 
        onClick={() => toggleComplete(item.id, item.completed)}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid #646cff',
          backgroundColor: item.completed ? '#646cff' : 'transparent',
          cursor: 'pointer',
          flexShrink: 0, // Prevents the circle from squishing if the text is long
          color: 'white'
        }}
      >
        {item.completed ? '✓' : ''}
      </button>

      <span style={{ 
        textDecoration: item.completed ? 'line-through' : 'none',
        color: item.completed ? '#888' : '#000',
        textAlign: 'left', // Force text to the left
        flex: 1            // Tells the text to take up the available space
      }}>
        {item.text}
      </span> 
    </div>

    <button
      onClick={() => deleteTodo(item.id)}
      style={{ color: '#ff4747', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
    >
      Delete
    </button>
  </li>
))}
      </ul>
      {/* CONDITIONAL MESSAGE: If the list is empty, show a message */}
      {list.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No tasks yet. Get to work!</p>}
     </div>
  )
}

export default App