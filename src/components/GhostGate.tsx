import React, { useState } from 'react';

interface GhostGateProps {
  onAuthenticated: () => void;
}

const GhostGate: React.FC<GhostGateProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://hook.eu2.make.com/399o1adt2r3c1ww4iu5bzkcco685gt8x', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          zone: 'demigod'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      return responseText.trim() === 'Accepted';
    } catch (error) {
      console.error('Password validation error:', error);
      throw new Error('Connection failed. Try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Enter access code');
      return;
    }

    setIsValidating(true);
    setError('');
    
    try {
      const isValid = await validatePassword(password);
      
      if (isValid) {
        onAuthenticated();
      } else {
        setError('❌ Access Denied.');
        setPassword('');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Validation failed');
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
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Ghost gate content */}
      <div className="relative z-10 text-center px-4 max-w-md w-full">
        {/* Minimal ghost indicator */}
        <div className="mb-12">
          <div className="w-2 h-2 bg-white rounded-full mx-auto animate-pulse opacity-60"></div>
        </div>

        {/* Operators only text */}
        <div className="mb-8">
          <p className="text-slate-400 text-sm font-mono tracking-[0.2em] uppercase">
            OPERATORS ONLY
          </p>
        </div>

        {/* Password form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-b border-slate-700 text-white text-center py-3 px-4 focus:outline-none focus:border-slate-500 transition-colors font-mono tracking-wider placeholder-slate-600"
              placeholder="••••••••"
              disabled={isValidating}
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={isValidating || !password.trim()}
            className="w-full py-3 text-slate-400 hover:text-white transition-colors font-mono text-sm tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isValidating ? 'VALIDATING...' : 'ENTER'}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-6">
            <p className="text-red-400 text-sm font-mono tracking-wide">
              {error}
            </p>
          </div>
        )}

        {/* Ghost footer */}
        <div className="mt-12">
          <div className="w-1 h-1 bg-slate-700 rounded-full mx-auto opacity-40"></div>
        </div>
      </div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default GhostGate;