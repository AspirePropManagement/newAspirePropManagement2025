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
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userRole: string;
  isMobile?: boolean;
}

export default function Sidebar({ collapsed, onToggle, userRole, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  // Common menu items for all roles
  const commonMenuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
  ];



  // Role-specific property management items
  const getRoleSpecificPropertyItems = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return [
          {
            name: 'Property Listing',
            href: '/properties',
            icon: ListBulletIcon,
            description: 'View and manage all properties'
          }
        ];
      case 'AGENT':
        return [
          {
            name: 'Property Listing',
            href: '/properties',
            icon: ListBulletIcon,
            description: 'View and manage all properties'
          }
        ];
      case 'BUILDER':
        return [
          {
            name: 'Property Listing',
            href: '/properties',
            icon: ListBulletIcon,
            description: 'View and manage all properties'
          }
        ];
      case 'BUYER':
        return [
          {
            name: 'Property Listing',
            href: '/properties',
            icon: ListBulletIcon,
            description: 'Browse and search all properties'
          }
        ];
      default:
        return [];
    }
  };

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
  ];

  // User account menu items
  const userMenuItems = [
    {
      name: 'Settings & Profile',
      href: '/settings',
      icon: Cog6ToothIcon,
    },
    {
      name: 'Sign Out',
      href: '#',
      icon: ArrowRightOnRectangleIcon,
      onClick: signOut,
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
          <item.icon className={`h-5 w-5 ${(isMobile || !collapsed) ? 'mr-3' : 'mx-auto'}`} />
          {(isMobile || !collapsed) && <span>{item.name}</span>}
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
        <item.icon className={`h-5 w-5 ${(isMobile || !collapsed) ? 'mr-3' : 'mx-auto'}`} />
        {(isMobile || !collapsed) && <span>{item.name}</span>}
      </Link>
    );
  };

  const RoleSpecificMenuItem = ({ item }: { item: any }) => {
    return (
      <Link
        href={item.href}
        className={`flex items-start px-4 py-3 text-sm font-medium rounded-md transition-colors ${
          isActive(item.href)
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <item.icon className={`h-5 w-5 mt-0.5 ${(isMobile || !collapsed) ? 'mr-3' : 'mx-auto'}`} />
        {(isMobile || !collapsed) && (
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-gray-500 mt-1">{item.description}</div>
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 h-screen flex flex-col ${
      isMobile ? 'w-64' : (collapsed ? 'w-16' : 'w-64')
    }`}>
      {/* Toggle Button - Only show on desktop */}
      {!isMobile && (
        <div className="flex-shrink-0 flex justify-end p-4 border-b border-gray-200">
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
      )}

      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex-shrink-0 flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Scrollable Menu Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {/* Common Menu Items */}
        {commonMenuItems.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}

        {/* Property Management Section */}
        <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
          isMobile ? '' : (collapsed ? 'text-center' : '')
        }`}>
          {(isMobile || !collapsed) && 'Property Management'}
        </div>
        
        {/* Role-Specific Property Items */}
        {getRoleSpecificPropertyItems(userRole).map((item) => (
          <RoleSpecificMenuItem key={item.name} item={item} />
        ))}

        {/* Admin Menu Items */}
        {userRole === 'ADMIN' && (
          <>
            <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
              isMobile ? '' : (collapsed ? 'text-center' : '')
            }`}>
              {(isMobile || !collapsed) && 'Admin Panel'}
            </div>
            {adminMenuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </>
        )}

        {/* User Account Menu Items */}
        <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
          isMobile ? '' : (collapsed ? 'text-center' : '')
        }`}>
          {(isMobile || !collapsed) && 'Account'}
        </div>
        {userMenuItems.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </nav>
    </div>
  );
}
