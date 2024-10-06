import React from 'react';
import Layout from './components/Layout';
import AgentList from './components/AgentList';
import ProjectOverview from './components/ProjectOverview';
import TaskList from './components/TaskList';
import ProjectCreation from './components/ProjectCreation';
import Dashboard from './components/Dashboard';
import { AgentProvider } from './contexts/AgentContext';
import { ProjectProvider } from './contexts/ProjectContext';

function App() {
  return (
    <AgentProvider>
      <ProjectProvider>
        <Layout>
          <ProjectCreation />
          <div className="mt-8">
            <Dashboard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Agents</h2>
              <AgentList />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
              <ProjectOverview />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
            <TaskList />
          </div>
        </Layout>
      </ProjectProvider>
    </AgentProvider>
  );
}

export default App;