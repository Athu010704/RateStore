import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import { ratingService } from '../services/ratingService';
import { FiStar, FiMapPin, FiMail, FiUser, FiClock, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

const StoreDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: () => storeService.getStoreById(id),
  });

  const ratingMutation = useMutation({
    mutationFn: (data) => ratingService.createRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['store', id]);
      toast.success('Rating submitted successfully');
      setSelectedRating(0);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    },
  });

  const handleRatingSubmit = () => {
    if (!isAuthenticated) {
      toast.error('Please login to rate stores');
      return;
    }
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    ratingMutation.mutate({
      userId: user.id,
      storeId: id,
      rating: selectedRating,
    });
  };

  if (storeLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const store = storeData?.data.store;

  if (!store) {
    return <div className="p-8">Store not found</div>;
  }

  const hasRated = store.ratings.some(r => r.userId === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
      >
        <div className="h-64 bg-gradient-to-br from-primary-400 to-blue-600 flex items-center justify-center">
          <FiShoppingBag className="w-24 h-24 text-white opacity-50" />
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {store.storeName}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <FiMail className="w-4 h-4" />
                  <span>{store.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiUser className="w-4 h-4" />
                  <span>Owner: {store.owner.fullName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg mt-4 md:mt-0">
              <FiStar className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {store.avgRating}
              </span>
              <span className="text-gray-600 dark:text-gray-400">({store.totalRatings} ratings)</span>
            </div>
          </div>

          <div className="flex items-start text-gray-600 dark:text-gray-400 mb-6">
            <FiMapPin className="w-5 h-5 mr-2 mt-0.5" />
            <span>{store.address}</span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = store.ratingDistribution.find(r => r.star === star)?.count || 0;
                const percentage = store.totalRatings > 0 ? (count / store.totalRatings) * 100 : 0;
                return (
                  <div key={star} className="flex items-center space-x-3">
                    <span className="w-8 text-sm text-gray-600 dark:text-gray-400">{star} star</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Ratings</h3>
            <div className="space-y-4">
              {store.ratings.length > 0 ? (
                store.ratings.map((rating) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{rating.user.fullName}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <FiClock className="w-3 h-3" />
                          <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                        <FiStar className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">{rating.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No ratings yet</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rate This Store</h3>
            {!isAuthenticated ? (
              <p className="text-gray-600 dark:text-gray-400">Please login to rate this store</p>
            ) : hasRated ? (
              <p className="text-gray-600 dark:text-gray-400">You have already rated this store</p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedRating >= star
                          ? 'text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                      }`}
                    >
                      <FiStar className="w-8 h-8" fill={selectedRating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRatingSubmit}
                  disabled={ratingMutation.isPending}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {ratingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
