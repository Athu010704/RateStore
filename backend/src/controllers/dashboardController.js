import { prisma } from '../config/database.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStores,
      totalRatings,
      usersByRole,
      recentUsers,
      recentStores,
      topRatedStores,
      ratingDistribution
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.store.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              fullName: true
            }
          },
          _count: {
            select: {
              ratings: true
            }
          }
        }
      }),
      prisma.store.findMany({
        include: {
          _count: {
            select: {
              ratings: true
            }
          },
          ratings: {
            select: {
              rating: true
            }
          }
        }
      }),
      prisma.rating.groupBy({
        by: ['rating'],
        _count: true
      })
    ]);

    const storesWithAvgRating = topRatedStores.map(store => {
      const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;
      return {
        ...store,
        avgRating: parseFloat(avgRating.toFixed(1)),
        ratings: undefined
      };
    });

    const sortedTopRatedStores = storesWithAvgRating
      .filter(store => store._count.ratings > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);

    const roleStats = {
      ADMIN: usersByRole.find(r => r.role === 'ADMIN')?._count || 0,
      USER: usersByRole.find(r => r.role === 'USER')?._count || 0,
      STORE_OWNER: usersByRole.find(r => r.role === 'STORE_OWNER')?._count || 0
    };

    const distribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: ratingDistribution.find(r => r.rating === star)?._count || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStores,
          totalRatings,
          usersByRole: roleStats
        },
        recentActivity: {
          recentUsers,
          recentStores
        },
        topRatedStores: sortedTopRatedStores,
        ratingDistribution: distribution
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getStoreOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [
      stores,
      totalRatings,
      recentRatings,
      storeRatingStats
    ] = await Promise.all([
      prisma.store.findMany({
        where: { ownerId },
        include: {
          _count: {
            select: {
              ratings: true
            }
          }
        }
      }),
      prisma.rating.count({
        where: {
          store: {
            ownerId
          }
        }
      }),
      prisma.rating.findMany({
        where: {
          store: {
            ownerId
          }
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          },
          store: {
            select: {
              storeName: true
            }
          }
        }
      }),
      prisma.store.findMany({
        where: { ownerId },
        include: {
          ratings: {
            select: {
              rating: true
            }
          }
        }
      })
    ]);

    const storesWithStats = storeRatingStats.map(store => {
      const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;
      const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: store.ratings.filter(r => r.rating === star).length
      }));
      return {
        storeId: store.id,
        storeName: store.storeName,
        totalRatings: store.ratings.length,
        avgRating: parseFloat(avgRating.toFixed(1)),
        ratingDistribution
      };
    });

    const overallAvgRating = storesWithStats.length > 0
      ? storesWithStats.reduce((sum, s) => sum + s.avgRating * s.totalRatings, 0) / totalRatings
      : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStores: stores.length,
          totalRatings,
          overallAvgRating: parseFloat(overallAvgRating.toFixed(1))
        },
        stores: storesWithStats,
        recentRatings
      }
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      user,
      userRatings,
      recentActivity
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.rating.findMany({
        where: { userId },
        include: {
          store: {
            select: {
              id: true,
              storeName: true,
              email: true,
              address: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.rating.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              storeName: true
            }
          }
        }
      })
    ]);

    const ratedStores = userRatings.map(rating => ({
      storeId: rating.store.id,
      storeName: rating.store.storeName,
      rating: rating.rating,
      ratedAt: rating.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalRatings: userRatings.length
        },
        ratedStores,
        recentActivity
      }
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
