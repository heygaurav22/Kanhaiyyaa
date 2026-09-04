import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const productsRouter = Router();

function parseProduct(p: any) {
  if (!p) return p;
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [],
  };
}

// GET /api/products
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      featured,
      isNew,
      tag,
      sort = 'newest',
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (category) {
      // Find category and all its children
      const cat = await prisma.category.findUnique({
        where: { slug: category as string },
        include: { children: { select: { id: true } } },
      });
      if (cat) {
        const categoryIds = [cat.id, ...cat.children.map(c => c.id)];
        where.categoryId = { in: categoryIds };
      }
    }

    if (search) {
      const searchStr = search as string;
      where.OR = [
        { name: { contains: searchStr } },
        { description: { contains: searchStr } },
        { tags: { contains: searchStr.toLowerCase() } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (isNew === 'true') {
      where.isNew = true;
    }

    if (tag) {
      where.tags = { contains: tag as string };
    }

    // Build orderBy
    let orderBy: Record<string, string> = {};
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          comparePrice: true,
          currency: true,
          images: true,
          featured: true,
          isNew: true,
          rating: true,
          reviewCount: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products.map(parseProduct),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug
productsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: { select: { id: true, name: true, slug: true } },
          },
        },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
            stock: true,
          },
          orderBy: [{ size: 'asc' }, { color: 'asc' }],
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.json({ success: true, data: parseProduct(product) });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});
