import React, { useState } from 'react';
import { useAgents } from '../contexts/AgentContext';
import { Activity, Code, Search, Bug, User, Cpu } from 'lucide-react';

const AgentList: React.FC = () => {
  const { agents, connectAgentToOllama } = useAgents();
  const [connecting, setConnecting] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const getAgentIcon = (role: string) => {
    switch (role) {
      case 'Developer':
        return <Code className="w-6 h-6" />;
      case 'Researcher':
        return <Search className="w-6 h-6" />;
      case 'Tester':
        return <Activity className="w-6 h-6" />;
      case 'Bug Fixer':
        return <Bug className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const handleConnectToOllama = async (agentId: string) => {
    setConnecting(prev => ({ ...prev, [agentId]: true }));
    setError(null);
    try {
      const success = await connectAgentToOllama(agentId, 'llama3:latest');
      if (!success) {
        setError('Failed to connect to Ollama. Please check if Ollama is running and the llama3:latest model is available.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setConnecting(prev => ({ ...prev, [agentId]: false }));
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {agents.map((agent) => (
          <li key={agent.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getAgentIcon(agent.role)}
                  <p className="ml-3 text-sm font-medium text-gray-900">{agent.name}</p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    agent.status === 'idle' ? 'bg-green-100 text-green-800' :
                    agent.status === 'working' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {agent.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {agent.role}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>{agent.currentTask || 'No current task'}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {agent.ollamaInstance ? `Connected to ${agent.ollamaInstance}` : 'Not connected to Ollama'}
                </p>
                {!agent.ollamaInstance && (
                  <button
                    onClick={() => handleConnectToOllama(agent.id)}
                    disabled={connecting[agent.id]}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {connecting[agent.id] ? (
                      <>
                        <Cpu className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Cpu className="-ml-1 mr-2 h-4 w-4" />
                        Connect to Ollama
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentList;