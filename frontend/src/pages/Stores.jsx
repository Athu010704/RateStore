import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import { FiSearch, FiPlus, FiStar, FiMapPin, FiMail, FiEdit2, FiTrash2, FiShoppingBag, FiX, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StoreCard = ({ store, onEdit, onDelete, isAdmin, isStoreOwner }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base overflow-hidden hover:shadow-elevated transition-all duration-300 group flex flex-col h-full"
    >
      <div className="h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />
        <FiShoppingBag className="w-12 h-12 text-white opacity-60" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1">
            {store.storeName}
          </h3>
          <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg flex-shrink-0">
            <FiStar className="w-4 h-4 text-amber-500 fill-current" />
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{store.avgRating}</span>
          </div>
        </div>
        
        <div className="space-y-2.5 mb-5 flex-1">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
            <FiMail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{store.email}</span>
          </div>
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 gap-2">
            <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{store.address}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
            Owner: {store.owner.fullName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {store.totalRatings} {store.totalRatings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={`/stores/${store.id}`}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-center py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5"
          >
            <span>View</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
          {(isAdmin || isStoreOwner) && (
            <>
              <button
                onClick={() => onEdit(store)}
                className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              {isAdmin && (
                <button
                  onClick={() => onDelete(store.id)}
                  className="p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Stores</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Browse and manage stores</p>
          </div>
          {(isAdmin || isStoreOwner) && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 btn-primary shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Store</span>
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search stores by name..."
              className="input-base pl-12"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-base h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {data?.data.stores.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <FiShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">No stores found</p>
              </motion.div>
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
              <div className="flex justify-center items-center space-x-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-600 dark:text-gray-400 font-medium min-w-fit">
                  Page {page} of {data.data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.data.pagination.totalPages, p + 1))}
                  disabled={page === data.data.pagination.totalPages}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="card-premium w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Store</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleCreateStore} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    required
                    minLength={3}
                    maxLength={100}
                    className="input-base"
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-base"
                    placeholder="Enter store email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    required
                    maxLength={400}
                    rows={3}
                    className="input-base"
                    placeholder="Enter store address"
                  />
                </div>
                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Store'}
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
