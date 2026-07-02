import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingService } from '../services/ratingService';
import { FiStar, FiEdit2, FiTrash2, FiUser, FiShoppingBag, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RatingCard = ({ rating, onEdit, onDelete, isAdmin, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <FiStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{rating.user.fullName}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <FiShoppingBag className="w-3 h-3" />
              <span className="truncate">{rating.store.storeName}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">
          <FiStar className="w-5 h-5 text-yellow-500" />
          <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{rating.rating}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500 mb-4">
        <FiClock className="w-4 h-4" />
        <span>{new Date(rating.createdAt).toLocaleString()}</span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span className="font-medium">Email:</span> {rating.user.email}
      </div>

      {(isAdmin || isUser) && (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(rating)}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(rating.id)}
            className="flex items-center justify-center p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

const Ratings = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { isAdmin, isUser } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['ratings', page],
    queryFn: () => ratingService.getRatings({ page, limit: 12 }),
  });

  const deleteMutation = useMutation({
    mutationFn: ratingService.deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries(['ratings']);
      toast.success('Rating deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete rating');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (rating) => {
    toast.info('Edit functionality coming soon');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ratings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage all ratings</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {data?.data.ratings.length === 0 ? (
            <div className="text-center py-12">
              <FiStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No ratings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.ratings.map((rating) => (
                <RatingCard
                  key={rating.id}
                  rating={rating}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                  isUser={isUser}
                />
              ))}
            </div>
          )}

          {data?.data.pagination && data.data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600 dark:text-gray-400">
                Page {page} of {data.data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.data.pagination.totalPages, p + 1))}
                disabled={page === data.data.pagination.totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Ratings;
