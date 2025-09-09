'use client';

import React from 'react';
import { NewProjectsCarousel } from '@/components/NewProjectsCarousel';
import { useNewProjects } from '@/hooks/useNewProjects';

/**
 * Test page for the NewProjectsCarousel component
 * This page can be used to test the carousel functionality
 */
export default function TestNewProjectsPage() {
  const { projects, loading, error } = useNewProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading new projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          New Projects Carousel Test
        </h1>
        <div className="mb-4 text-center">
          <p className="text-gray-600">
            Found {projects.length} new projects
          </p>
        </div>
        <NewProjectsCarousel projects={projects} />
      </div>
    </div>
  );
}
