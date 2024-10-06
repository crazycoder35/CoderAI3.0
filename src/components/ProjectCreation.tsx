import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Project, Task } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const ProjectCreation: React.FC = () => {
  const { setProject } = useProject();
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  const [showTaskReview, setShowTaskReview] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [error, setError] = useState('');

  const generateTasks = async (projectName: string, template: string): Promise<Task[]> => {
    try {
      const response = await axios.post('/api/generate-tasks', {
        projectName,
        template
      }, {
        timeout: 10000 // 10 seconds timeout
      });
      return response.data.tasks;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        } else if (error.response) {
          throw new Error(`Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response from server. Please check your network connection.');
        }
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  };

  const handleGenerateTasks = async () => {
    setError('');
    if (!projectName || !template) {
      setError('Please provide both project name and template before generating tasks.');
      return;
    }
    try {
      const tasks = await generateTasks(projectName, template);
      setGeneratedTasks(tasks);
      setShowTaskReview(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      path: `/home/project/AI Coder System/${projectName}`,
      tasks: generatedTasks,
      submodules: ['Setup', 'Frontend', 'Backend', 'Database']
    };
    setProject(newProject);
    setShowTaskReview(false);
    console.log('Project created:', newProject);
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectName">
          Project Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="projectName"
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template">
          Project Template
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="">Select a template</option>
          <option value="e-commerce">E-commerce</option>
          <option value="ai">AI/Machine Learning</option>
          <option value="other">Other</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleGenerateTasks}
        >
          Generate Tasks
        </button>
      </div>
      {showTaskReview && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Review Generated Tasks</h3>
          <ul className="space-y-2">
            {generatedTasks.map((task) => (
              <li key={task.id} className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{task.description}</span>
                  <button
                    onClick={() => toggleTaskExpansion(task.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {expandedTasks.includes(task.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {expandedTasks.includes(task.id) && (
                  <div className="mt-2 pl-4">
                    <p>Assigned to: {task.assignedTo}</p>
                    <p>Status: {task.status}</p>
                    <p>Priority: {task.priority}</p>
                    <p>Submodule: {task.submodule}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCreation;