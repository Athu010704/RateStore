import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { FiUsers, FiShoppingBag, FiStar, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { isAdmin, isStoreOwner, isUser } = useAuth();

  const { data: adminData, isLoading: adminLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: dashboardService.getAdminDashboard,
    enabled: isAdmin,
  });

  const { data: ownerData, isLoading: ownerLoading } = useQuery({
    queryKey: ['ownerDashboard'],
    queryFn: dashboardService.getStoreOwnerDashboard,
    enabled: isStoreOwner,
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userDashboard'],
    queryFn: dashboardService.getUserDashboard,
    enabled: isUser,
  });

  if (isAdmin && adminLoading) return <div className="p-8">Loading...</div>;
  if (isStoreOwner && ownerLoading) return <div className="p-8">Loading...</div>;
  if (isUser && userLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isAdmin ? 'Admin Dashboard' : isStoreOwner ? 'Store Owner Dashboard' : 'My Dashboard'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {isAdmin && adminData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FiUsers}
              label="Total Users"
              value={adminData.data.overview.totalUsers}
              color="bg-blue-500"
            />
            <StatCard
              icon={FiShoppingBag}
              label="Total Stores"
              value={adminData.data.overview.totalStores}
              color="bg-green-500"
            />
            <StatCard
              icon={FiStar}
              label="Total Ratings"
              value={adminData.data.overview.totalRatings}
              color="bg-yellow-500"
            />
            <StatCard
              icon={FiTrendingUp}
              label="Avg Rating"
              value={adminData.data.overview.totalRatings > 0 
                ? (adminData.data.ratingDistribution.reduce((sum, r) => sum + r.star * r.count, 0) / adminData.data.overview.totalRatings).toFixed(1)
                : '0'}
              color="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users by Role</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Admin</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{adminData.data.overview.usersByRole.ADMIN}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Store Owners</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{adminData.data.overview.usersByRole.STORE_OWNER}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Users</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{adminData.data.overview.usersByRole.USER}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Rated Stores</h3>
              <div className="space-y-3">
                {adminData.data.topRatedStores.slice(0, 5).map((store) => (
                  <div key={store.id} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 truncate">{store.storeName}</span>
                    <div className="flex items-center space-x-2">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{store.avgRating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isStoreOwner && ownerData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={FiShoppingBag}
              label="My Stores"
              value={ownerData.data.overview.totalStores}
              color="bg-green-500"
            />
            <StatCard
              icon={FiStar}
              label="Total Ratings"
              value={ownerData.data.overview.totalRatings}
              color="bg-yellow-500"
            />
            <StatCard
              icon={FiTrendingUp}
              label="Avg Rating"
              value={ownerData.data.overview.overallAvgRating}
              color="bg-purple-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Performance</h3>
            <div className="space-y-4">
              {ownerData.data.stores.map((store) => (
                <div key={store.storeId} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{store.storeName}</h4>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{store.avgRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{store.totalRatings} ratings</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isUser && userData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={FiStar}
              label="Ratings Given"
              value={userData.data.stats.totalRatings}
              color="bg-yellow-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recently Rated Stores</h3>
            <div className="space-y-4">
              {userData.data.ratedStores.length > 0 ? (
                userData.data.ratedStores.map((item) => (
                  <div key={item.storeId} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.storeName}</h4>
                      <div className="flex items-center space-x-1">
                        <FiStar className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No ratings yet. Start rating stores!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
