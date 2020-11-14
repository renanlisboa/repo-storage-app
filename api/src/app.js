const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(cors());

// REPOSITORIES SAVED IN MEMORY
const repositories = [];

// APP MIDDLEWARES
function validateRepoId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: 'Invalide repository ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepoId);

// APP ROUTES
app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return res.json(repositories);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }

  const repository = repositories[repoIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }

  const repository = repositories[repoIndex];
  repository.likes += 1;
  res.json(repository);
});

module.exports = app;
