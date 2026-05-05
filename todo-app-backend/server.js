const express = require('express'); // this import the express library so we can use it
const cors = require('cors'); // this import the cors library to handle cross-origin requests
const app = express(); // this initialize the express application
const PORT = 5000; // Define the port where the server will live.
app.use(cors()); // middleware: this allows our server to accept requests from different origins (like our React frontend running on a different port).
app.use(express.json()); // middleware: this allows server to understand JSON data sent from the frontend.

// "MOCK DATABASE - instead of cloud database.

let tasks = [
      
];

//==============
//  ROUTES
//==============

//"GET" Route - The gate way.

app.get('/api/tasks', (req, res) => {
    // res.json() is like res.send(), but it specifically formats the data as a json object 
    // 
    res.send(tasks); 
})

//"POST" route
app.post('/api/tasks', (req, res) => {
    // 'req.body' contains the data sent from the frontend (React)
    const newTask = {
        id: tasks.length + 1, // Simple way to generate a new ID
        text: req.body.text,  // We grab the text sent by the user
        completed: false      // Default status for a new task
    };

    // Add the new task to our "Mock Database" array
    tasks.push(newTask);

    // Send back the newly created task and a 201 status code (which means "Created")
    res.status(201).json(newTask);
});

// "DELETE" route
app.delete('/api/tasks/:id', (req, res) => {
    // 1. Grab the ID from the URL using 'req.params'
    // We use parseInt because the ID in the URL comes in as a String ("1"), 
    // but our Mock Database IDs are Numbers (1).
    const taskId = parseInt(req.params.id);

    // 2. Logic to "Delete"
    // We use .filter() to create a NEW array that includes every task 
    // EXCEPT the one with the ID we want to delete.
    tasks = tasks.filter(task => task.id !== taskId);

    // 3. Send a confirmation message back
    res.json({ message: `Task with ID ${taskId} has been deleted.`, currentTasks: tasks });
    
    // Log it to your terminal so you can see it happening
    console.log(`Deleted task ID: ${taskId}`);
});

// 5 "PATCH" Route (To toggle completion)
app.patch('/api/tasks/:id', (req, res) => {
    // Convert the string from the URL into a Number
    const id = Number(req.params.id); 
    
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.completed = req.body.completed;
    res.json(task);
});
app.listen(PORT, () => {
    console.log(`server is flying on http://localhost:${PORT}`);
});
