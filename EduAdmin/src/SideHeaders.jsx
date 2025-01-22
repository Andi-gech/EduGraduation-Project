import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
const Sidebar = () => {
  const location = useLocation();

  
  const notShowAllowed = ['/login', '/register'];
  const isAuthenticated = useIsAuthenticated()

  if (notShowAllowed.includes(location.pathname)|| !isAuthenticated) {
    return null; 
  }

  const auth = useAuthUser()
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'CafeController', path: '/cafe' },
    { name: 'Complains', path: '/complain' },
    { name: 'Students', path: '/student' },
    { name: 'Academics', path: '/academics' },
    { name: 'SocialClubs', path: '/socialClubs' },
    { name: 'Event', path: '/event' },
    { name: 'Permission', path: '/permission' },
    { name: 'Notification', path: '/notification' },
  ];
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: 128,
      seed: auth.email,
      backgroundColor: '#f3f4f6',
    
    }).toDataUri();
  }, []);

  return (
    <div className="w-[300px] bg-gradient-to-r from-white via-white to-white shadow-zinc-100 shadow-lg h-screen flex flex-col items-center pt-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-white rounded-full mb-2">
          <img
            src={avatar}
            alt="Profile"
            className='rounded-full'
           />
        </div>
        <h2 className="text-sm font-semibold text-gray-800">{auth.email}</h2>
        <p className="text-sm text-gray-500">Admin</p>

      </div>

      <ul className="w-[300px]">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={index} className="w-full text-center my-2">
              <Link
                to={item.path}
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-yellow-50 text-black font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
