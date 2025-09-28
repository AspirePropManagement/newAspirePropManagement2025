import DashboardLayout from '@/components/DashboardLayout';
import { AdsBannersManager } from '@/components/AdsBannersManager';

/**
 * Admin page for managing Ads Banners (image-only, base64)
 * Role gating is handled globally (middleware/users), this page just renders the manager UI.
 */
export default function AdsBannersPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdsBannersManager />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


