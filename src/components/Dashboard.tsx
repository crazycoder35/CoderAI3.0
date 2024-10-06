import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useAgents } from '../contexts/AgentContext';
import { BarChart2, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { project } = useProject();
  const { agents } = useAgents();
  const [userMessage, setUserMessage] = React.useState('');

  if (!project) {
    return null;
  }

  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Message to Project Owner AI:', userMessage);
    // Here you would typically send this message to your backend or process it
    setUserMessage('');
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Dashboard</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart2 className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Overall Progress</dt>
                    <dd>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{progress.toFixed(0)}%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{completedTasks} / {totalTasks}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Agents</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {agents.filter(agent => agent.status !== 'idle').length} / {agents.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Communicate with Project Owner AI</h4>
          <form onSubmit={handleMessageSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;