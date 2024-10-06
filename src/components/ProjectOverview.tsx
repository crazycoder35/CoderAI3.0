import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Folder, ListTodo, CheckSquare } from 'lucide-react';

const ProjectOverview: React.FC = () => {
  const { project } = useProject();

  if (!project) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
        No project selected. Create a new project to get started.
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Overview</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{project.name}</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Folder className="mr-2 h-5 w-5 text-gray-400" />
              Project Path
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.path}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <ListTodo className="mr-2 h-5 w-5 text-gray-400" />
              Total Tasks
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.tasks.length}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <CheckSquare className="mr-2 h-5 w-5 text-gray-400" />
              Completed Tasks
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {project.tasks.filter(task => task.status === 'completed').length}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProjectOverview;