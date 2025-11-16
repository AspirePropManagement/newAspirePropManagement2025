'use client';

import React, { useState } from 'react';
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
  ListBulletIcon,
  PhotoIcon,
  DocumentTextIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userRole: string;
  isMobile?: boolean;
  onPostPropertyClick?: () => void;
}

export default function Sidebar({ collapsed, onToggle, userRole, isMobile = false, onPostPropertyClick }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    signOut();
    setShowLogoutModal(false);
    // Redirect to login page after logout
    window.location.href = '/auth';
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Get dashboard route based on user role
  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'AGENT':
        return '/agent';
      case 'BUILDER':
        return '/builder';
      case 'BUYER':
        return '/buyer';
      default:
        return '/dashboard';
    }
  };

  // Common menu items for all roles
  const commonMenuItems = [
    {
      name: 'Dashboard',
      href: getDashboardRoute(userRole),
      icon: HomeIcon,
    },
  ];

  // Role-specific property management items
  const getRoleSpecificPropertyItems = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return [
          {
            name: 'Post Property',
            href: '#',
            icon: PlusIcon,
            description: 'Post new property listings',
            onClick: onPostPropertyClick
          },
          {
            name: 'My Listings',
            href: '/my-listings',
            icon: ListBulletIcon,
            description: 'View and manage your property listings'
          }
        ];
      case 'AGENT':
        return [
          {
            name: 'Post Property',
            href: '#',
            icon: PlusIcon,
            description: 'Post new property listings',
            onClick: onPostPropertyClick
          },
          {
            name: 'My Listings',
            href: '/my-listings',
            icon: ListBulletIcon,
            description: 'View and manage your property listings'
          }
        ];
      case 'BUILDER':
        return [
          {
            name: 'Post Property',
            href: '#',
            icon: PlusIcon,
            description: 'Post new property listings',
            onClick: onPostPropertyClick
          },
          {
            name: 'My Listings',
            href: '/my-listings',
            icon: ListBulletIcon,
            description: 'View and manage your property listings'
          }
        ];
      case 'BUYER':
        return [
          {
            name: 'Post Property',
            href: '#',
            icon: PlusIcon,
            description: 'Post new property listings',
            onClick: onPostPropertyClick
          },
          {
            name: 'My Listings',
            href: '/my-listings',
            icon: ListBulletIcon,
            description: 'View and manage your property listings'
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
    {
      name: 'Hero Carousel',
      href: '/admin/hero-carousel',
      icon: PhotoIcon,
    },
    {
      name: 'Ads Banners',
      href: '/admin/ads-banners',
      icon: PhotoIcon,
    },
    {
      name: 'Services',
      href: '/admin/services',
      icon: DocumentTextIcon,
    },
    {
      name: 'Blogs',
      href: '/admin/blogs',
      icon: DocumentTextIcon,
    },
  ];

  // User account menu items
  const userMenuItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
    },
    {
      name: 'Sign Out',
      href: '#',
      icon: ArrowRightOnRectangleIcon,
      onClick: handleLogoutClick,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const MenuItem = ({ item }: { item: any }) => {
    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-md transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
        >
          <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${(isMobile || !collapsed) ? 'mr-2 sm:mr-3' : 'mx-auto'}`} />
          {(isMobile || !collapsed) && <span className="truncate">{item.name}</span>}
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-md transition-all duration-300 ${
          isActive(item.href)
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
        }`}
      >
        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${(isMobile || !collapsed) ? 'mr-2 sm:mr-3' : 'mx-auto'}`} />
        {(isMobile || !collapsed) && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  const RoleSpecificMenuItem = ({ item }: { item: any }) => {
    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className={`w-full flex items-start px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-md transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm`}
        >
          <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 ${(isMobile || !collapsed) ? 'mr-2 sm:mr-3' : 'mx-auto'}`} />
          {(isMobile || !collapsed) && (
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium truncate">{item.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{item.description}</div>
            </div>
          )}
        </button>
      );
    }
    
    return (
      <Link
        href={item.href}
        className={`flex items-start px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-md transition-all duration-300 ${
          isActive(item.href)
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
        }`}
      >
        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 ${(isMobile || !collapsed) ? 'mr-2 sm:mr-3' : 'mx-auto'}`} />
        {(isMobile || !collapsed) && (
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.name}</div>
            <div className="text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{item.description}</div>
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
        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
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
            <div className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
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
        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
          isMobile ? '' : (collapsed ? 'text-center' : '')
        }`}>
          {(isMobile || !collapsed) && 'Account'}
        </div>
        {userMenuItems.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Confirm Logout</h3>
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to sign out?
              <br />
              <span className="text-xs sm:text-sm text-gray-500">You will need to sign in again to access your account.</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 sm:px-6 py-2.5 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 sm:px-6 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
