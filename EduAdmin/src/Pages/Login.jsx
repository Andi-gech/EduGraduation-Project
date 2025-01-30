import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Api from '../utils/Api';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import {  useNavigate} from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const signIn = useSignIn();
  const navigation =useNavigate();

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await Api.post('/auth/adminlogin', credentials);
      return response.data;
    },
    onSuccess: (data) => {

      console.log('Login successful:', data);
      if(signIn({
        auth: {
            token: data.token,
            type: 'Bearer'
        },
      
        userState: {
            email: data.user.email,
            uid: data.user.id,
            role: data.user.Role
        }
    })){
        navigation('/')
    }else {
        //Throw error
    }
    },
    onError: (error) => {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-orange-200 to-yellow-200">
        
      <div className="bg-white relative overflow-hidden bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
    
        <div className="flex justify-center mb-6">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtVftIdBU2AuaJHATg-hb7sQ19n9ZYzYSQMw&s" alt="Logo" className="h-[100px] w-[100px] rounded-md" />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
