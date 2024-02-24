const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5001;
const db = require("./db");

app.use(express.json());
app.use(cors());

app.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks ");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/new-task", (req, res) => {
  const { task } = req.body;

  db.query(
    "INSERT INTO tasks (task) VALUES ($1) RETURNING *",
    [task],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Task added with ID: ${results.rows[0].id}`);
    }
  );
});

app.put("/update-task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;

  console.log(id, task);

  db.query(
    "UPDATE tasks SET task = $1 WHERE id = $2",
    [task, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.send(`Task updated with id: ${id}`);
    }
  );
});

app.delete("/delete-task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.query("DELETE FROM tasks WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`User deleted with ID: ${id}`);
  });
});

app.get("/", (req, res) => {
  res.send("Node Server has started");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
