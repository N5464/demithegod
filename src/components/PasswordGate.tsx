import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordGateProps {
  zone: string;
  title: string;
  description: string;
  onUnlock: () => void;
  className?: string;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ 
  zone, 
  title, 
  description, 
  onUnlock,
  className = ""
}) => {
  const [password, setPassword] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validatePassword = async (password: string, zone: string): Promise<boolean> => {
    try {
      const response = await fetch('https://demigang.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          zone
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read response as text since webhook returns plain text "Accepted"
      const responseText = await response.text();
      
      return responseText.trim() === 'Accepted';
    } catch (error) {
      console.error('Password validation error:', error);
      throw new Error('Failed to validate password. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }

    setIsValidating(true);
    
    try {
      const isValid = await validatePassword(password, zone);
      
      if (isValid) {
        toast.success('Access granted');
        onUnlock();
      } else {
        toast.error('Wrong password');
        setPassword('');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating) {
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Lock size={24} className="text-primary-500" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input w-full text-center"
          placeholder="Enter access code"
          disabled={isValidating}
          autoFocus
        />
        
        <button
          type="submit"
          disabled={isValidating || !password.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isValidating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Validating...</span>
            </>
          ) : (
            <>
              <Lock size={16} />
              <span>Unlock Access</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;