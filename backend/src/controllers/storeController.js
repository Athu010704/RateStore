import { prisma } from '../config/database.js';

export const getStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, ownerId, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { storeName: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } }
      ];
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          _count: {
            select: {
              ratings: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.store.count({ where })
    ]);

    const storesWithAvgRating = await Promise.all(
      stores.map(async (store) => {
        const ratings = await prisma.rating.findMany({
          where: { storeId: store.id },
          select: { rating: true }
        });

        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

        return {
          ...store,
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalRatings: ratings.length
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        stores: storesWithAvgRating,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const avgRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: store.ratings.filter(r => r.rating === star).length
    }));

    res.status(200).json({
      success: true,
      data: {
        store: {
          ...store,
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalRatings: store.ratings.length,
          ratingDistribution
        }
      }
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createStore = async (req, res) => {
  try {
    const { storeName, email, address, ownerId } = req.body;

    const owner = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    if (owner.role !== 'STORE_OWNER' && owner.role !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'User must be a STORE_OWNER or ADMIN to own a store'
      });
    }

    const existingStore = await prisma.store.findFirst({
      where: { email }
    });

    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: 'Store email already registered'
      });
    }

    const store = await prisma.store.create({
      data: {
        storeName,
        email,
        address,
        ownerId
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { storeName, email, address, ownerId } = req.body;

    const existingStore = await prisma.store.findUnique({
      where: { id }
    });

    if (!existingStore) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (email && email !== existingStore.email) {
      const emailExists = await prisma.store.findFirst({
        where: { email }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    if (ownerId && ownerId !== existingStore.ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId }
      });

      if (!owner) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found'
        });
      }

      if (owner.role !== 'STORE_OWNER' && owner.role !== 'ADMIN') {
        return res.status(400).json({
          success: false,
          message: 'User must be a STORE_OWNER or ADMIN to own a store'
        });
      }
    }

    const store = await prisma.store.update({
      where: { id },
      data: {
        ...(storeName && { storeName }),
        ...(email && { email }),
        ...(address !== undefined && { address }),
        ...(ownerId && { ownerId })
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: { store }
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await prisma.store.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
