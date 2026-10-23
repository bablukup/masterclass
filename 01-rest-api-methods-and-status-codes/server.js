const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`\n🔥 API Hit: [${req.method}] ${req.url}`);
  next();
});

let tasks = [{ id: 1, title: "Learn REST API", done: false }];
let nextId = 2;

// GET: fetch all tasks
app.get("/tasks", (req, res) => {
  console.log("📦 Sending all tasks to client...");
  res.status(200).json(tasks);
});

// POST: create a task
app.post("/tasks", (req, res) => {
  const { title } = req.body ?? {};
  if (!title) return res.status(400).json({ error: "title required" });

  const task = { id: nextId++, title, done: false };
  tasks.push(task);

  console.log("✅ New Task Added! Current Tasks List:", tasks);
  res.status(201).json(task);
});

// PUT: replace the whole task
app.put("/tasks/:id", (req, res) => {
  const i = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: "Not found" });

  tasks[i] = { id: tasks[i].id, ...req.body };
  console.log("⚠️ PUT Used (Replaced everything):", tasks[i]);
  res.status(200).json(tasks[i]);
});

// PATCH: change only what was sent
app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Not found" });

  Object.assign(task, req.body);
  console.log("✨ PATCH Used (Partially updated):", task);
  res.status(200).json(task);
});

// DELETE: remove a task
app.delete("/tasks/:id", (req, res) => {
  const i = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: "Not found" });

  const deletedTask = tasks.splice(i, 1);
  console.log("❌ Task Deleted! Remaining Tasks:", tasks);
  res.status(200).json({ message: "Deleted", deletedTask });
});

app.listen(3000, () =>
  console.log("🚀 Server is running on http://localhost:3000"),
);
