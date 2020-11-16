import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';


export default function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  },[repositories])

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Desafio ${Date.now()}`, 
      url: `http://github.com/${Date.now()}`, 
      techs: ["NodeJS", "ReactJS", "React Native"]
    });

    setRepositories([...repositories]);
  }

  async function handleRemoveRepository(id) {
    const repoIndex = repositories.findIndex(repository => repository.id === id);
    const repository = repositories[repoIndex];

    await api.delete(`/repositories/${repository.id}`)
    setRepositories([...repositories]);
  }
  
  async function handleLikeRepository(id) {
    const repoIndex = repositories.findIndex(repository => repository.id === id);
    const repository = repositories[repoIndex];

    await api.post(`/repositories/${repository.id}/like`);
    setRepositories([...repositories]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository  }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
        
              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>{tech}</Text>
                ))}
              </View>
        
              <View style={styles.likesContainer}>
                <Text style={styles.likeText}>{`${repository.likes} curtida${repository.likes === 1 ? '' : 's'}`}</Text>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                >
                  <Text style={styles.likeButtonText}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRemoveRepository(repository.id)}
                >
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddRepository}>
          <Text style={styles.buttonText}>Adicionar Projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  
  repositoryContainer: {
    marginBottom: 15,
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 4,
  },

  repository: {
    fontSize: 24,
    fontWeight: "bold",
  },

  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },

  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },

  button: {
    marginTop: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
  },

  likeButtonText: {
    width: 120,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'center',
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 4,
  },

  removeButtonText: {
    width: 120,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'center',
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#ca4949",
    padding: 15,
    borderRadius: 4,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
    margin: 15,
    color: "#7159c1",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 4,
  },
});
