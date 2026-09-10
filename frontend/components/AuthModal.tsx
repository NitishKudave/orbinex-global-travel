'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Lock, Mail, Phone, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, loginDemo, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [username, setUsername] = useState('demo_user');
  const [password, setPassword] = useState('Demo@Orbinex2026!');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
        });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (type: 'user' | 'admin') => {
    setError('');
    setLoading(true);
    try {
      await loginDemo(type);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 relative"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#071322] to-[#0F2942] p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <motion.div
              animate={{ rotate: [0, 8, 0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h2 className="text-xl font-bold">
            {mode === 'login' ? 'Welcome Back to Orbinex' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login' ? 'Manage your bookings, e-tickets & saved travelers' : 'Join our global travel privilege network'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Quick Demo Access Bar */}
          <div className="p-3 bg-cyan-50/80 rounded-2xl border border-cyan-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                1-Click Instant Demo Login:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleDemo('user')}
                disabled={loading}
                className="bg-white hover:bg-cyan-100/50 border border-cyan-200 text-cyan-800 text-xs font-bold py-1.5 px-2 rounded-xl transition shadow-xs text-center cursor-pointer"
              >
                👤 Customer Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleDemo('admin')}
                disabled={loading}
                className="bg-white hover:bg-purple-100/50 border border-purple-200 text-purple-800 text-xs font-bold py-1.5 px-2 rounded-xl transition shadow-xs text-center cursor-pointer"
              >
                ⚡ Admin Demo
              </motion.button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Morgan"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-cyan-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Username</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="demo_user"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 12px 20px 0 rgb(6 182 208 / 0.4)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register Account'}
            </motion.button>
          </form>

          {/* Toggle between login and register */}
          <div className="text-center pt-2 border-t border-slate-100">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-cyan-600 font-bold hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-cyan-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
