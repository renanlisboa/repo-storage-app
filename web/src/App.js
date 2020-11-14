import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, [repositories]);
  
  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Desafio ${Date.now()}`, 
	    url: `http://github.com/${Date.now()}`, 
	    techs: ["Node.js ", "React.js"]
    });

    const repository = response.data;
    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const repoIndex = repositories.findIndex(repository => repository.id === id);
    const repository = repositories[repoIndex];

    await api.delete(`/repositories/${repository.id}`);
    setRepositories([...repositories]);
  }

  async function handdleAddLikes(id) {
    const repoIndex = repositories.findIndex(repository => repository.id === id);
    const repository = repositories[repoIndex];

    await api.post(`/repositories/${repository.id}/like`);
    setRepositories([...repositories]);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => <li key={repository.id}>
          Título: {repository.title}<br/>
          URL: {repository.url}<br/>
          Techs: {repository.techs}<br/>
          Likes: {repository.likes} <button className="like-btn" onClick={() => handdleAddLikes(repository.id)}>Like</button>
          <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button></li>)}
          <button onClick={handleAddRepository}>Adicionar</button>
      </ul>
    </div>
  );
}

export default App;
