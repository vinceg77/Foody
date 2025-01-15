import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Apple, ChefHat, Bell, BarChart2, Settings, Puzzle, Box } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
  { icon: Apple, label: 'Mes aliments', href: '/foods' },
  { icon: ChefHat, label: 'Recettes', href: '/recipes' },
  { icon: Box, label: 'Stockage', href: '/storage' },
  { icon: Bell, label: 'Rappels', href: '/reminders' },
  { icon: BarChart2, label: 'Statistiques', href: '/stats' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
  { icon: Puzzle, label: 'Extensions', href: '/extensions' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm">
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`flex items-center px-6 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg mx-2 ${
                  location.pathname === item.href ? 'bg-green-50 text-green-600' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}