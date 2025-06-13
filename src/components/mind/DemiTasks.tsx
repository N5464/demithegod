import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = 'https://tawbsjqosxdtqsskaddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2JzanFvc3hkdHFzc2thZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzMwMjAsImV4cCI6MjA2NDU0OTAyMH0.ASP0YqSdpcLj_FmLyOyme1iLYm2Z8CbJyrNJVREiZ6U';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  created_at: Date;
  dueDate?: Date;
  user_id: string;
}

const DemiTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Task['priority'],
    dueDate: ''
  });
  const [filter, setFilter] = useState<'All' | 'Todo' | 'In Progress' | 'Done'>('All');

  // Hardcoded user ID to match RLS policy
  const userId = 'demigod_owner';

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('demitasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedTasks = data?.map(task => ({
        ...task,
        created_at: new Date(task.created_at),
        dueDate: task.due_date ? new Date(task.due_date) : undefined
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add new task to Supabase
  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('demitasks')
        .insert([
          {
            user_id: userId,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            status: 'Todo',
            due_date: newTask.dueDate || null
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const formattedTask: Task = {
        ...data,
        created_at: new Date(data.created_at),
        dueDate: data.due_date ? new Date(data.due_date) : undefined
      };

      setTasks(prev => [formattedTask, ...prev]);

      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: ''
      });

      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  // Update task status in Supabase
  const updateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from('demitasks')
        .update({ status })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status } : task
      ));

      toast.success('Task status updated');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  // Delete task from Supabase
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('demitasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

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

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-primary-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-gray-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

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
                    <span>Created {task.created_at.toLocaleDateString()}</span>
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