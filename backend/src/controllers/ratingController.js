import { prisma } from '../config/database.js';

export const getRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, storeId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (userId) where.userId = userId;
    if (storeId) where.storeId = storeId;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          store: {
            select: {
              id: true,
              storeName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.rating.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        ratings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            storeName: true,
            email: true,
            address: true
          }
        }
      }
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { rating }
    });
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getRatingsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { storeId },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.rating.count({ where: { storeId } })
    ]);

    const avgRating = total > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: ratings.filter(r => r.rating === star).length
    }));

    res.status(200).json({
      success: true,
      data: {
        ratings,
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalRatings: total,
        ratingDistribution,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get ratings by store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createRating = async (req, res) => {
  try {
    const { userId, storeId, rating } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      }
    });

    if (existingRating) {
      return res.status(409).json({
        success: false,
        message: 'User has already rated this store'
      });
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        storeId,
        rating
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            storeName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: { rating: newRating }
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const existingRating = await prisma.rating.findUnique({
      where: { id }
    });

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { rating },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            storeName: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      data: { rating: updatedRating }
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id }
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    await prisma.rating.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
