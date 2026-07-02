import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import { FiSearch, FiPlus, FiStar, FiMapPin, FiMail, FiEdit2, FiTrash2, FiShoppingBag, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StoreCard = ({ store, onEdit, onDelete, isAdmin, isStoreOwner }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-gradient-to-br from-primary-400 to-blue-600 flex items-center justify-center">
        <FiShoppingBag className="w-16 h-16 text-white opacity-50" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {store.storeName}
          </h3>
          <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
            <FiStar className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">{store.avgRating}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiMail className="w-4 h-4 mr-2" />
            <span className="truncate">{store.email}</span>
          </div>
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <FiMapPin className="w-4 h-4 mr-2 mt-0.5" />
            <span className="line-clamp-2">{store.address}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Owner: {store.owner.fullName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {store.totalRatings} ratings
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/stores/${store.id}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 rounded-lg transition-colors text-sm font-medium"
          >
            View Details
          </Link>
          {(isAdmin || isStoreOwner) && (
            <>
              <button
                onClick={() => onEdit(store)}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              {isAdmin && (
                <button
                  onClick={() => onDelete(store.id)}
                  className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Stores = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isAdmin, isStoreOwner, user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['stores', search, page],
    queryFn: () => storeService.getStores({ search, page, limit: 12 }),
  });

  const deleteMutation = useMutation({
    mutationFn: storeService.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries(['stores']);
      toast.success('Store deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete store');
    },
  });

  const createMutation = useMutation({
    mutationFn: storeService.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries(['stores']);
      toast.success('Store created successfully');
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create store');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (store) => {
    toast.info('Edit functionality coming soon');
  };

  const handleCreateStore = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const storeData = {
      storeName: formData.get('storeName'),
      email: formData.get('email'),
      address: formData.get('address'),
    };
    createMutation.mutate(storeData);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stores</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Browse and manage stores</p>
        </div>
        {(isAdmin || isStoreOwner) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Store</span>
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search stores..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {data?.data.stores.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No stores found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                  isStoreOwner={isStoreOwner}
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

    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Store</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateStore} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  required
                  minLength={3}
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter store email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address (max 400 characters)
                </label>
                <textarea
                  name="address"
                  required
                  maxLength={400}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter store address"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isLoading ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Stores;
