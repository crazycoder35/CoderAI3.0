import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/generate-tasks', (req, res) => {
  const { projectName, template } = req.body;
  
  // This is a simple task generation logic. In a real-world scenario,
  // you might want to use more sophisticated AI or rule-based systems.
  const generateTasks = (projectName, template) => {
    const commonTasks = [
      { id: '1', description: 'Set up project structure', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Setup' },
      { id: '2', description: 'Create README.md', assignedTo: 'Developer', status: 'pending', priority: 'medium', submodule: 'Setup' },
      { id: '3', description: 'Set up version control', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Setup' },
    ];

    const templateSpecificTasks = {
      'e-commerce': [
        { id: '4', description: 'Design database schema', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Database' },
        { id: '5', description: 'Implement user authentication', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Backend' },
        { id: '6', description: 'Create product listing page', assignedTo: 'Developer', status: 'pending', priority: 'medium', submodule: 'Frontend' },
        { id: '7', description: 'Implement shopping cart functionality', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Frontend' },
      ],
      'ai': [
        { id: '4', description: 'Set up machine learning environment', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Setup' },
        { id: '5', description: 'Implement data preprocessing pipeline', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Backend' },
        { id: '6', description: 'Develop model training script', assignedTo: 'Developer', status: 'pending', priority: 'high', submodule: 'Backend' },
        { id: '7', description: 'Create model evaluation metrics', assignedTo: 'Developer', status: 'pending', priority: 'medium', submodule: 'Backend' },
      ],
      'other': [
        { id: '4', description: 'Define project requirements', assignedTo: 'Researcher', status: 'pending', priority: 'high', submodule: 'Setup' },
        { id: '5', description: 'Create project timeline', assignedTo: 'Developer', status: 'pending', priority: 'medium', submodule: 'Setup' },
        { id: '6', description: 'Set up basic frontend structure', assignedTo: 'Developer', status: 'pending', priority: 'medium', submodule: 'Frontend' },
        { id: '7', description: 'Set up basic backend structure', assignedTo: 'Developer', status: 'pending', priority: 'medium', submodule: 'Backend' },
      ],
    };

    return [...commonTasks, ...(templateSpecificTasks[template] || templateSpecificTasks['other'])];
  };

  const tasks = generateTasks(projectName, template);

  res.json({ tasks });
});

// Handle any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});