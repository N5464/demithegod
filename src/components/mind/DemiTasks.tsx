import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  createdAt: Date;
  dueDate?: Date;
}

const DemiTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Task['priority'],
    dueDate: ''
  });
  const [filter, setFilter] = useState<'All' | 'Todo' | 'In Progress' | 'Done'>('All');

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'Todo',
      createdAt: new Date(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '' });
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'All' ? true : task.status === filter
  );

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'text-error-500 bg-error-50';
      case 'Medium': return 'text-warning-500 bg-warning-50';
      case 'Low': return 'text-success-500 bg-success-50';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Todo': return 'text-gray-500 bg-gray-50';
      case 'In Progress': return 'text-primary-500 bg-primary-50';
      case 'Done': return 'text-success-500 bg-success-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Task */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={20} className="text-primary-500" />
          <h3 className="text-lg font-semibold">Add New Task</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Task title"
              className="input"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div className="md:col-span-2">
            <textarea
              placeholder="Task description (optional)"
              className="input resize-none"
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div>
            <select
              className="select"
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          
          <div>
            <input
              type="date"
              className="input"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
          
          <div className="md:col-span-2">
            <button
              onClick={addTask}
              disabled={!newTask.title.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Todo', 'In Progress', 'Done'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status} ({status === 'All' ? tasks.length : tasks.filter(t => t.status === status).length})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            <CheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p>Add your first task to get started with founder operations.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-medium ${task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mb-2 ${task.status === 'Done' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Created {task.createdAt.toLocaleDateString()}</span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Due {task.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                    className={`text-xs px-2 py-1 rounded border-0 font-medium ${getStatusColor(task.status)}`}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-error-500 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DemiTasks;