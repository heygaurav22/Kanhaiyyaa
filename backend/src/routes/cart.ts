import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

export const cartRouter = Router();

// All cart routes require auth
cartRouter.use(authenticateToken);

function formatCartItem(item: any) {
  if (!item) return item;
  return {
    ...item,
    product: item.product ? {
      ...item.product,
      images: typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images || [],
    } : item.product,
  };
}

// GET /api/cart
cartRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        },
        variant: {
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedItems = items.map(formatCartItem);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    res.json({
      success: true,
      data: {
        items: formattedItems,
        subtotal,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

// POST /api/cart — add item to cart
cartRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, error: 'Product ID is required' });
      return;
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Check variant if provided
    if (variantId) {
      const variant = await prisma.variant.findUnique({ where: { id: variantId } });
      if (!variant || variant.productId !== productId) {
        res.status(400).json({ success: false, error: 'Invalid variant' });
        return;
      }
      if (variant.stock < quantity) {
        res.status(400).json({ success: false, error: 'Insufficient stock' });
        return;
      }
    }

    // Upsert cart item (add quantity if same product+variant exists)
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: req.user!.id,
          productId,
          variantId: variantId || null,
        },
      },
    });

    let cartItem;
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: {
          product: { select: { id: true, name: true, slug: true, price: true, images: true } },
          variant: { select: { id: true, size: true, color: true, colorHex: true, stock: true } },
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user!.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
        include: {
          product: { select: { id: true, name: true, slug: true, price: true, images: true } },
          variant: { select: { id: true, size: true, color: true, colorHex: true, stock: true } },
        },
      });
    }

    res.status(201).json({ success: true, data: formatCartItem(cartItem) });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add item to cart' });
  }
});

// PATCH /api/cart/:itemId — update quantity
cartRouter.patch('/:itemId', async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
      return;
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
    });

    if (!item || item.userId !== req.user!.id) {
      res.status(404).json({ success: false, error: 'Cart item not found' });
      return;
    }

    const updated = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity },
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, images: true } },
        variant: { select: { id: true, size: true, color: true, colorHex: true, stock: true } },
      },
    });

    res.json({ success: true, data: formatCartItem(updated) });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:itemId — remove item
cartRouter.delete('/:itemId', async (req: AuthRequest, res: Response) => {
  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
    });

    if (!item || item.userId !== req.user!.id) {
      res.status(404).json({ success: false, error: 'Cart item not found' });
      return;
    }

    await prisma.cartItem.delete({ where: { id: req.params.itemId } });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove item from cart' });
  }
});
