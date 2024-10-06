import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { CheckCircle, Clock, AlertCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const TaskList: React.FC = () => {
  const { project, updateTaskStatus, updateTaskPriority } = useProject();
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [visibleTasks, setVisibleTasks] = useState(10);

  if (!project) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const handleFeedbackChange = (taskId: string, value: string) => {
    setFeedback(prev => ({ ...prev, [taskId]: value }));
  };

  const handleFeedbackSubmit = (taskId: string) => {
    console.log(`Feedback submitted for task ${taskId}: ${feedback[taskId]}`);
    // Here you would typically send this feedback to your backend or process it
    setFeedback(prev => ({ ...prev, [taskId]: '' }));
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const loadMoreTasks = () => {
    setVisibleTasks(prev => prev + 10);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {project.tasks.slice(0, visibleTasks).map((task) => (
          <li key={task.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow">
                  {getStatusIcon(task.status)}
                  <p className="ml-3 text-sm font-medium text-gray-900 flex-grow">{task.description}</p>
                  <span className="ml-2 text-sm text-gray-500">{task.assignedTo}</span>
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{task.submodule}</span>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                    className="mr-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    value={task.priority}
                    onChange={(e) => updateTaskPriority(task.id, e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {task.subtasks && task.subtasks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="ml-2 text-gray-400 hover:text-gray-500"
                    >
                      {expandedTasks.includes(task.id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {task.subtasks && task.subtasks.length > 0 && expandedTasks.includes(task.id) && (
                <ul className="mt-2 pl-6 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask.id} className="flex items-center justify-between">
                      <div className="flex items-center flex-grow">
                        {getStatusIcon(subtask.status)}
                        <p className="ml-3 text-sm font-medium text-gray-900 flex-grow">{subtask.description}</p>
                        <span className="ml-2 text-sm text-gray-500">{subtask.assignedTo}</span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subtask.priority === 'high' ? 'bg-red-100 text-red-800' :
                          subtask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {subtask.priority}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <select
                          value={subtask.status}
                          onChange={(e) => updateTaskStatus(subtask.id, e.target.value as any)}
                          className="mr-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <select
                          value={subtask.priority}
                          onChange={(e) => updateTaskPriority(subtask.id, e.target.value as any)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={feedback[task.id] || ''}
                  onChange={(e) => handleFeedbackChange(task.id, e.target.value)}
                  placeholder="Add feedback..."
                  className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  onClick={() => handleFeedbackSubmit(task.id)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {visibleTasks < project.tasks.length && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={loadMoreTasks}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Load More Tasks
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;