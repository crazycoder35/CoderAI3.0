import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Agent, AgentContextType } from '../types';

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const OLLAMA_BASE_URL = 'http://localhost:11434'; // Ollama default port

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(() => {
    const savedAgents = localStorage.getItem('agents');
    return savedAgents ? JSON.parse(savedAgents) : [
      { id: '1', name: 'Developer', role: 'Developer', status: 'idle', currentTask: '', ollamaInstance: '' },
      { id: '2', name: 'Researcher', role: 'Researcher', status: 'idle', currentTask: '', ollamaInstance: '' },
      { id: '3', name: 'Tester', role: 'Tester', status: 'idle', currentTask: '', ollamaInstance: '' },
      { id: '4', name: 'Bug Fixer', role: 'Bug Fixer', status: 'idle', currentTask: '', ollamaInstance: '' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  const updateAgentStatus = (agentId: string, status: Agent['status'], currentTask: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, status, currentTask } : agent
      )
    );
  };

  const connectAgentToOllama = async (agentId: string, modelName: string) => {
    try {
      // Check if Ollama is running and the model is available
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: modelName,
        prompt: "Hello, are you ready?",
        stream: false
      });

      if (response.status === 200) {
        setAgents(prevAgents =>
          prevAgents.map(agent =>
            agent.id === agentId ? { ...agent, ollamaInstance: modelName } : agent
          )
        );
        console.log(`Agent ${agentId} connected to Ollama using model ${modelName}`);
        return true;
      }
    } catch (error) {
      console.error('Error connecting to Ollama:', error);
      throw new Error('Failed to connect to Ollama. Please make sure Ollama is running and the model is available.');
    }
    return false;
  };

  return (
    <AgentContext.Provider value={{ agents, updateAgentStatus, connectAgentToOllama }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};