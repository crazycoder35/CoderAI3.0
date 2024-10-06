import { ReactNode } from 'react';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'completed';
  currentTask: string;
  ollamaInstance: string;
}

export interface Task {
  id: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  submodule: string;
  parentTaskId?: string;
  subtasks?: Task[];
}

export interface Project {
  id: string;
  name: string;
  path: string;
  tasks: Task[];
  submodules: string[];
}

export interface AgentContextType {
  agents: Agent[];
  updateAgentStatus: (agentId: string, status: Agent['status'], currentTask: string) => void;
  connectAgentToOllama: (agentId: string, ollamaInstance: string) => void;
}

export interface ProjectContextType {
  project: Project | null;
  setProject: (project: Project) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskPriority: (taskId: string, priority: Task['priority']) => void;
}

export interface LayoutProps {
  children: ReactNode;
}