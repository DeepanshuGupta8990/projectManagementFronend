import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Adjust the base URL to your API endpoint
});

const App = () => {
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newDeveloperName, setNewDeveloperName] = useState('');
  const [newDeveloperEmail, setNewDeveloperEmail] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [addProjects, setAddProjects] = useState([]);
  const [removeProjects, setRemoveProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [addDevelopers, setAddDevelopers] = useState([]);
  const [removeDevelopers, setRemoveDevelopers] = useState([]);

  // Fetch developers and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const devRes = await api.get('/developers');
        const projRes = await api.get('/projects');
        setDevelopers(devRes.data);
        setProjects(projRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleAddDeveloper = async () => {
    try {
      const response = await api.post('/developers', { name: newDeveloperName, email: newDeveloperEmail });
      setDevelopers([...developers, response.data]);
      setNewDeveloperName('');
      setNewDeveloperEmail('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await api.post('/projects', { name: newProjectName , description: newProjectDescription});
      setProjects([...projects, response.data]);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDeveloperProjects = async () => {
    try {
      await api.put(`/developers/${selectedDeveloper}/update-projects`, {
        addProjects,
        removeProjects,
      });
      // Refresh developers and projects after update
      const devRes = await api.get('/developers');
      const projRes = await api.get('/projects');
      setDevelopers(devRes.data);
      setProjects(projRes.data);
      setAddProjects([]);
      setRemoveProjects([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectDevelopers = async () => {
    try {
      await api.put(`/projects/${selectedProject}/update-developers`, {
        addDevelopers,
        removeDevelopers,
      });
      // Refresh developers and projects after update
      const devRes = await api.get('/developers');
      const projRes = await api.get('/projects');
      setDevelopers(devRes.data);
      setProjects(projRes.data);
      setAddDevelopers([]);
      setRemoveDevelopers([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Project Manager</h1>

      <div style={{border:"1px solid black"}}>
        <h2>Add Developer</h2>
        <input
          type="text"
          value={newDeveloperName}
          onChange={(e) => setNewDeveloperName(e.target.value)}
          placeholder="Developer Name"
        />
        <input
          type="email"
          value={newDeveloperEmail}
          onChange={(e) => setNewDeveloperEmail(e.target.value)}
          placeholder="Developer Email"
        />
        <button onClick={handleAddDeveloper}>Add Developer</button>
      </div>

      <div style={{border:"1px solid black", margin:"10px 0px"}}>
        <h2>Add Project</h2>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Project Name"
        />
        <input
          type="text"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="Project Description"
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      <div style={{border:"1px solid black", margin:"10px 0px"}}>
        <h2>Update Developer's Projects</h2>
        <select onChange={(e) => setSelectedDeveloper(e.target.value)} value={selectedDeveloper}>
          <option value="">Select Developer</option>
          {developers.map((dev) => (
            <option key={dev._id} value={dev._id}>{dev.name}</option>
          ))}
        </select>
        <div>
          <h3>Add Projects to Developer</h3>
          {projects.map((proj) => (
            <label key={proj._id}>
              <input
                type="checkbox"
                value={proj._id}
                checked={addProjects.includes(proj._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAddProjects([...addProjects, proj._id]);
                  } else {
                    setAddProjects(addProjects.filter((id) => id !== proj._id));
                  }
                }}
              />
              {proj.name}
            </label>
          ))}
        </div>
        <div>
          <h3>Remove Projects from Developer</h3>
          {projects.map((proj) => (
            <label key={proj._id}>
              <input
                type="checkbox"
                value={proj._id}
                checked={removeProjects.includes(proj._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRemoveProjects([...removeProjects, proj._id]);
                  } else {
                    setRemoveProjects(removeProjects.filter((id) => id !== proj._id));
                  }
                }}
              />
              {proj.name}
            </label>
          ))}
        </div>
        <button onClick={handleUpdateDeveloperProjects}>Update Developer's Projects</button>
      </div>

      <div style={{border:"1px solid black", margin:"10px 0px"}}>
        <h2>Update Project's Developers</h2>
        <select onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj._id} value={proj._id}>{proj.name}</option>
          ))}
        </select>
        <div>
          <h3>Add Developers to Project</h3>
          {developers.map((dev) => (
            <label key={dev._id}>
              <input
                type="checkbox"
                value={dev._id}
                checked={addDevelopers.includes(dev._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAddDevelopers([...addDevelopers, dev._id]);
                  } else {
                    setAddDevelopers(addDevelopers.filter((id) => id !== dev._id));
                  }
                }}
              />
              {dev.name}
            </label>
          ))}
        </div>
        <div>
          <h3>Remove Developers from Project</h3>
          {developers.map((dev) => (
            <label key={dev._id}>
              <input
                type="checkbox"
                value={dev._id}
                checked={removeDevelopers.includes(dev._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRemoveDevelopers([...removeDevelopers, dev._id]);
                  } else {
                    setRemoveDevelopers(removeDevelopers.filter((id) => id !== dev._id));
                  }
                }}
              />
              {dev.name}
            </label>
          ))}
        </div>
        <button onClick={handleUpdateProjectDevelopers}>Update Project's Developers</button>
      </div>

      <div style={{border:"1px solid black", margin:"10px 0px"}}>
        <h2>Developers</h2>
        <ul>
          {developers.map((dev) => (
            <li key={dev._id}>
              <h3>{dev.name} ({dev.email})</h3>
              <ul>
                {dev.projects.map((projectElement) => (
                  <li key={projectElement._id}>{projectElement ? projectElement.name : 'Unknown Project'}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div style={{border:"1px solid black", margin:"10px 0px"}}>
        <h2>Projects</h2>
        <ul>
          {projects.map((proj) => (
            <li key={proj._id}>
              <h3>{proj.name}</h3>
              <ul>
                {proj.developers.map((developerElement) => (
                  <li key={developerElement._id}>{developerElement ? `${developerElement.name}(${developerElement.email})` : 'Unknown Developer'}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
