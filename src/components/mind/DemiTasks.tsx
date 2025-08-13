import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Clock, Target } from 'lucide-react';
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
      toast.error('Failed to load mission tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add new task to Supabase
  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Mission title required');
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

      toast.success('Mission task logged successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to log mission task');
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

      toast.success('Mission status updated');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update mission status');
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
      toast.success('Mission task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete mission task');
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
      case 'High': return 'text-red-400 bg-red-600/20 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'Low': return 'text-green-400 bg-green-600/20 border-green-500/30';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Todo': return 'text-slate-400 bg-slate-700/50 border-slate-600/50';
      case 'In Progress': return 'text-blue-400 bg-blue-600/20 border-blue-500/30';
      case 'Done': return 'text-green-400 bg-green-600/20 border-green-500/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-blue-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-slate-400">Loading mission tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Task */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/30 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/30 p-3 rounded-lg border border-blue-500/50">
              <Plus size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                📋 NEW MISSION TASK
              </h3>
              <p className="text-blue-400 text-sm font-semibold">Add Operational Objective</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Mission title"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="md:col-span-2">
              <textarea
                placeholder="Mission description (optional)"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div>
              <select
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                onClick={addTask}
                disabled={!newTask.title.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span className="tracking-wide">LOG MISSION TASK</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Todo', 'In Progress', 'Done'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              filter === status
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
            }`}
          >
            {status.toUpperCase()} ({status === 'All' ? tasks.length : tasks.filter(t => t.status === status).length})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center text-slate-400">
            <Target size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium mb-2">No mission tasks found</p>
            <p className="text-sm">Add your first operational objective to begin founder mission management.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 hover:bg-slate-700/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-semibold ${task.status === 'Done' ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mb-3 ${task.status === 'Done' ? 'text-slate-500' : 'text-slate-300'}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
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
                    className={`text-xs px-3 py-1 rounded-full border font-bold ${getStatusColor(task.status)}`}
                  >
                    <option value="Todo">📋 TODO</option>
                    <option value="In Progress">🔄 IN PROGRESS</option>
                    <option value="Done">✅ DONE</option>
                  </select>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-600/10"
                    title="Delete mission task"
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