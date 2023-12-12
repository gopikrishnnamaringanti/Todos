const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://gopi:gopi@cluster0.vf3dbpp.mongodb.net/todos", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Define Schema
const todoSchema = new mongoose.Schema({
  task: String,
  Priority: String,
  Category: String,
  status: {
    type: String,
    default: "pending",
  },
  ts: {
    type: Date,
    default: Date.now,
  },
});

// Create Model
const Todo = mongoose.model("Todo", todoSchema);

// Routes (Example for adding a task)
app.post("/AddTask", async (req, res) => {
  const { task, Priority, Category } = req.body;
  try {
    const newTodo = await Todo.create({ task, Priority, Category });
    console.log(newTodo)
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send("Error occurred while adding task");
  }
});
// GET request for tasks created today
app.get('/today', async (req, res) => {
  try {
    const todayTasks = await Todo.find({ ts: { $gte: new Date().setHours(0, 0, 0, 0) } });
    res.send(todayTasks);
  } catch (err) {
    console.error("Error fetching today's tasks:", err);
    res.status(500).send("Error occurred while fetching today's tasks");
  }
});

// GET request for completed tasks
app.get('/completed', async (req, res) => {
  try {
    const completedTasks = await Todo.find({ status: 'completed' });
    res.send(completedTasks);
  } catch (err) {
    console.error("Error fetching com pleted tasks:", err);
    res.status(500).send("Error occurred while fetching completed tasks");
  }
});

// GET request for tasks categorized as 'Personal'
app.get('/personal', async (req, res) => {
  try {
    const personalTasks = await Todo.find({ Category: 'Personal' });
    res.send(personalTasks);
  } catch (err) {
    console.error("Error fetching personal tasks:", err);
    res.status(500).send("Error occurred while fetching personal tasks");
  }
});

app.get('/LowPriority', async (req, res) => {
  const Priority = req.params.Priority;
  try {
    const priorityTasks = await Todo.find({ Priority: "Low" });
    res.send(priorityTasks);
  } catch (err) {
    console.error(`Error fetching ${Priority} priority tasks:`, err);
    res.status(500).send(`Error occurred while fetching ${priority} priority tasks`);
  }
});

// GET request for tasks based on priority
app.get('/MediumPriority', async (req, res) => {
  const Priority = req.params.Priority;
  try {
    const priorityTasks = await Todo.find({ Priority: "Medium" });
    res.send(priorityTasks);
  } catch (err) {
    console.error(`Error fetching ${Priority} priority tasks:`, err);
    res.status(500).send(`Error occurred while fetching ${priority} priority tasks`);
  }
});

app.get('/HighPriority', async (req, res) => {
  const Priority = req.params.Priority;
  try {
    const priorityTasks = await Todo.find({ Priority: "High" });
    res.send(priorityTasks);
  } catch (err) {
    console.error(`Error fetching ${Priority} priority tasks:`, err);
    res.status(500).send(`Error occurred while fetching ${priority} priority tasks`);
  }
});

// GET request for all tasks
app.get("/AllTasks", async (req, res) => {
  try {
    const allTasks = await Todo.find();
    res.send(allTasks);
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    res.status(500).send("Error occurred while fetching all tasks");
  }
});

// DELETE request to delete a task by ID
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTask = await Todo.findByIdAndDelete(id);
    res.send(deletedTask);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error occurred while deleting task");
  }
});

// PUT request to update task status by ID
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTask = await Todo.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
    res.send(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Error occurred while updating task");
  }
});

// Serve React build
const path = require("path");
app.use(express.static(path.join(__dirname, './build')));

// Middleware for page refresh
const pageRefresh = (request, response) => {
  response.sendFile(path.join(__dirname, './build/index.html'));
}
app.use("*", pageRefresh);

// Other routes and CRUD operations can be similarly defined...

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
