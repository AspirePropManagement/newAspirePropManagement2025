'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  UsersIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userRole: string;
}

export default function Sidebar({ collapsed, onToggle, userRole }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Common menu items for all roles
  const commonMenuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Properties',
      href: '/properties',
      icon: BuildingOfficeIcon,
    },
  ];

  // Admin-specific menu items
  const adminMenuItems = [
    {
      name: 'Agents',
      href: '/admin/agents',
      icon: UserGroupIcon,
    },
    {
      name: 'Buyers',
      href: '/admin/buyers',
      icon: ShoppingBagIcon,
    },
    {
      name: 'Builders',
      href: '/admin/builders',
      icon: WrenchScrewdriverIcon,
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
    },
  ];

  // User account menu items
  const userMenuItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: UserCircleIcon,
    },
    {
      name: 'Sign Out',
      href: '#',
      icon: ArrowRightOnRectangleIcon,
      onClick: logout,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const MenuItem = ({ item }: { item: any }) => {
    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
          {!collapsed && <span>{item.name}</span>}
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
          isActive(item.href)
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onToggle}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          {collapsed ? (
            <Bars3Icon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2 space-y-1">
        {/* Common Menu Items */}
        {commonMenuItems.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}

        {/* Admin Menu Items */}
        {userRole === 'ADMIN' && (
          <>
            <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
              collapsed ? 'text-center' : ''
            }`}>
              {!collapsed && 'Admin Panel'}
            </div>
            {adminMenuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </>
        )}

        {/* User Account Menu Items */}
        <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
          collapsed ? 'text-center' : ''
        }`}>
          {!collapsed && 'Account'}
        </div>
        {userMenuItems.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </nav>
    </div>
  );
}
