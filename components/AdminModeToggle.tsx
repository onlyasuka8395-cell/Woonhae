import React from 'react';

interface AdminModeToggleProps {
  isAdmin: boolean;
  onToggle: () => void;
}

const AdminModeToggle: React.FC<AdminModeToggleProps> = ({ isAdmin, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${isAdmin ? 'text-gray-400' : 'text-gray-800'}`}>
        일반 모드
      </span>
      <button
        onClick={onToggle}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isAdmin ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isAdmin}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
            isAdmin ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isAdmin ? 'text-indigo-600' : 'text-gray-400'}`}>
        관리자 모드
      </span>
    </div>
  );
};

export default AdminModeToggle;
