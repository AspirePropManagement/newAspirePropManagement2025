import { HeroCarouselManager } from '../../../components/HeroCarouselManager';
import DashboardLayout from '../../../components/DashboardLayout';

/**
 * Admin page for managing hero carousel images
 * Accessible to all users (role restriction removed)
 */
export default function HeroCarouselPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroCarouselManager />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
