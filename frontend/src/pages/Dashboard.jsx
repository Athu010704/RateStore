import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { FiUsers, FiShoppingBag, FiStar, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-base p-6 hover:shadow-elevated transition-all duration-300 group"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</p>
        <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {isAdmin ? 'Admin Dashboard' : isStoreOwner ? 'Store Owner Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your account.
        </p>
      </motion.div>

      {isAdmin && adminData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FiUsers}
              label="Total Users"
              value={adminData.data.overview.totalUsers}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={FiShoppingBag}
              label="Total Stores"
              value={adminData.data.overview.totalStores}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={FiStar}
              label="Total Ratings"
              value={adminData.data.overview.totalRatings}
              color="bg-gradient-to-br from-amber-500 to-amber-600"
            />
            <StatCard
              icon={FiTrendingUp}
              label="Avg Rating"
              value={adminData.data.overview.totalRatings > 0 
                ? (adminData.data.ratingDistribution.reduce((sum, r) => sum + r.star * r.count, 0) / adminData.data.overview.totalRatings).toFixed(1)
                : '0'}
              color="bg-gradient-to-br from-primary-500 to-primary-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-base p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Users by Role</h3>
              <div className="space-y-4">
                {[
                  { label: 'Admin', value: adminData.data.overview.usersByRole.ADMIN, color: 'from-purple-500 to-purple-600' },
                  { label: 'Store Owners', value: adminData.data.overview.usersByRole.STORE_OWNER, color: 'from-blue-500 to-blue-600' },
                  { label: 'Users', value: adminData.data.overview.usersByRole.USER, color: 'from-emerald-500 to-emerald-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-base p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Rated Stores</h3>
              <div className="space-y-3">
                {adminData.data.topRatedStores.slice(0, 5).map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-gray-600 dark:text-gray-400 font-medium truncate">{store.storeName}</span>
                    <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
                      <FiStar className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{store.avgRating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={FiStar}
              label="Total Ratings"
              value={ownerData.data.overview.totalRatings}
              color="bg-gradient-to-br from-amber-500 to-amber-600"
            />
            <StatCard
              icon={FiTrendingUp}
              label="Avg Rating"
              value={ownerData.data.overview.overallAvgRating}
              color="bg-gradient-to-br from-primary-500 to-primary-600"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Store Performance</h3>
            <div className="space-y-3">
              {ownerData.data.stores.map((store) => (
                <div key={store.storeId} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{store.storeName}</h4>
                    <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
                      <FiStar className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{store.avgRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{store.totalRatings} ratings</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {isUser && userData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={FiStar}
              label="Ratings Given"
              value={userData.data.stats.totalRatings}
              color="bg-gradient-to-br from-amber-500 to-amber-600"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recently Rated Stores</h3>
            <div className="space-y-3">
              {userData.data.ratedStores.length > 0 ? (
                userData.data.ratedStores.map((item) => (
                  <div key={item.storeId} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.storeName}</h4>
                      <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
                        <FiStar className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiStar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No ratings yet. Start rating stores!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
