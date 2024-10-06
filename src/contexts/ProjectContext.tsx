import React, { createContext, useState, useContext, useEffect } from 'react';
import { Project, ProjectContextType, Task } from '../types';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(() => {
    const savedProject = localStorage.getItem('currentProject');
    return savedProject ? JSON.parse(savedProject) : null;
  });

  useEffect(() => {
    if (project) {
      localStorage.setItem('currentProject', JSON.stringify(project));
    } else {
      localStorage.removeItem('currentProject');
    }
  }, [project]);

  const addTask = (task: Task) => {
    if (project) {
      const updatedProject = { ...project, tasks: [...project.tasks, task] };
      setProject(updatedProject);
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    if (project) {
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      );
      const updatedProject = { ...project, tasks: updatedTasks };
      setProject(updatedProject);
    }
  };

  const updateTaskPriority = (taskId: string, priority: Task['priority']) => {
    if (project) {
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, priority } : task
      );
      const updatedProject = { ...project, tasks: updatedTasks };
      setProject(updatedProject);
    }
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, addTask, updateTaskStatus, updateTaskPriority }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};