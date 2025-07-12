import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordState {
  email: string;
  isSubmitting: boolean;
  isEmailSent: boolean;
  error: string | null;
}

const ForgotPassword: React.FC = () => {
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    isSubmitting: false,
    isEmailSent: false,
    error: null
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        isEmailSent: true,
        error: null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: 'Failed to send reset email. Please try again.' 
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setState(prev => ({ 
      ...prev, 
      email, 
      error: null 
    }));
  };

  const handleTryAgain = () => {
    setState({
      email: '',
      isSubmitting: false,
      isEmailSent: false,
      error: null
    });
  };

  if (state.isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Check Your Email
              </h2>
              <p className="text-gray-600">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-medium text-indigo-600 break-all">
                {state.email}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Again
                </Button>
                
                <Link to="/auth/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <Mail className="w-8 h-8 text-indigo-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={state.email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-full"
                disabled={state.isSubmitting}
                required
              />
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {state.error}
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={state.isSubmitting || !state.email}
            >
              {state.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/auth/login">
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;