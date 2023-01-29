const express = require('express');
const fs = require('fs');
let app = express();

// middleware
app.use(express.json());
let tasks = JSON.parse(fs.readFileSync('./data/todoData.json'));

app.get('/tasks', (req, res) => {
  res.status(200).json({
    status: 'success',
    count: tasks.length,
    data: {
      tasks: tasks
    }
  });
});

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id * 1;
  const task = tasks.find(el => el.id === id);
  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: `message with id ${id} not found`
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      task: task
    }
  });
});

app.post('/tasks', (req, res) => {
  const newId = tasks[tasks.length - 1].id + 1;
  const newTask = {
    id: newId,
    name: req.body.name,
    isCompleted: false
  };
  tasks.push(newTask);
  fs.writeFile('./data/todoData.json', JSON.stringify(tasks), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        task: newTask
      }
    });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id * 1;
  const taskToDelete = tasks.find(el => el.id === id);
  const taskIndex = tasks.indexOf(taskToDelete);
  if (!taskToDelete) {
    return res.status(404).json({
      status: 'fail',
      message: `no task found with id ${id}`
    });
  }
  tasks.splice(taskIndex, 1);
  fs.writeFile('./data/todoData.json', JSON.stringify(tasks), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        task: null
      }
    });
  });
});




const port = 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});


