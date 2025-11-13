
import React, { useState } from 'react';
import { HomeIcon, UsersIcon, ClipboardDocumentListIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, Bars3Icon, XMarkIcon, ServerStackIcon } from '@heroicons/react/24/outline';

type View = 'dashboard' | 'clients' | 'plans' | 'servers' | 'templates' | 'history';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'clients', label: 'Clientes', icon: UsersIcon },
    { id: 'plans', label: 'Planos', icon: ClipboardDocumentListIcon },
    { id: 'servers', label: 'Servidores', icon: ServerStackIcon },
    { id: 'templates', label: 'Modelos de Mensagem', icon: ChatBubbleBottomCenterTextIcon },
    { id: 'history', label: 'Histórico', icon: ClockIcon },
  ];
  
  const NavLinks = () => (
    <nav className="mt-8">
      {navItems.map(item => (
        <a
          key={item.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView(item.id as View);
            setIsMobileMenuOpen(false);
          }}
          className={`flex items-center px-4 py-3 my-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
            currentView === item.id
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <item.icon className="h-6 w-6 mr-3" />
          {item.label}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-400 bg-gray-800 hover:bg-gray-700">
          {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 dark:bg-gray-900 text-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">IPTV Painel</h1>
        </div>
        <div className="px-4 py-6">
          <NavLinks />
        </div>
      </div>
    </>
  );
};

export default Sidebar;