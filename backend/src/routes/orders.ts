import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

export const ordersRouter = Router();

// POST /api/orders/verify-payment — simulate payment gateway webhook / verification
ordersRouter.post('/verify-payment', async (req: Request, res: Response) => {
  try {
    const { paymentId, orderId, method } = req.body;
    // In production, verify signature with Razorpay/Gateway secret
    // Here we simulate instantaneous cryptographic verification
    res.json({
      success: true,
      data: {
        verified: true,
        paymentId: paymentId || `pay_${Date.now()}`,
        status: 'PAID',
        method: method || 'UPI',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});

// Admin stats
ordersRouter.get('/admin/stats', async (_req: Request, res: Response) => {
  try {
    const [totalOrders, orders, productsCount, variants] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.product.count(),
      prisma.variant.findMany({ select: { stock: true } }),
    ]);

    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const totalInventoryStock = variants.reduce((acc, curr) => acc + curr.stock, 0);
    const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED').length;
    const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
    const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        productsCount,
        totalInventoryStock,
        confirmedCount,
        shippedCount,
        deliveredCount,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// Admin get all orders
ordersRouter.get('/admin/all', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin orders' });
  }
});

// Admin update order status
ordersRouter.patch('/admin/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid order status' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true, address: true, user: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Admin status update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

// Admin inventory overview
ordersRouter.get('/admin/inventory', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Admin inventory error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inventory' });
  }
});

// POST /api/orders — Create order (Supports both Authenticated User and Guest Checkout)
ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      addressId,
      guestAddress,
      guestEmail,
      guestName,
      paymentMethod = 'UPI',
      notes,
      couponCode,
      items: directItems,
    } = req.body;

    let userId: string | null = null;

    // Check auth header if present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'clothingweb-secret-key-change-in-production') as any;
        userId = decoded.id;
      } catch (err) {
        // Token invalid, fall back to guest flow if guest email provided
      }
    }

    // If guest, create or reuse guest user account
    if (!userId) {
      const email = guestEmail || 'guest@kanhaiyya.com';
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: guestName || 'Devotional Patron',
            password: 'guest-checkout-auto-generated',
          },
        });
      }
      userId = user.id;
    }

    let finalAddressId = addressId;

    // If guest address payload provided directly
    if (!finalAddressId && guestAddress) {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          line1: guestAddress.line1,
          line2: guestAddress.line2 || null,
          city: guestAddress.city,
          state: guestAddress.state,
          postcode: guestAddress.postcode,
          phone: guestAddress.phone,
          label: guestAddress.label || 'Home',
          country: 'India',
        },
      });
      finalAddressId = newAddress.id;
    }

    if (!finalAddressId) {
      res.status(400).json({ success: false, error: 'Shipping address is required' });
      return;
    }

    // Determine items: either from user cart or passed directly from checkout bag
    let orderItemsToCreate: Array<{
      productId: string;
      variantId?: string | null;
      productName: string;
      size?: string | null;
      color?: string | null;
      quantity: number;
      price: number;
      image?: string | null;
    }> = [];

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      for (const item of directItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (product) {
          const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;
          orderItemsToCreate.push({
            productId: product.id,
            variantId: item.variantId || null,
            productName: product.name,
            size: item.size || variant?.size || 'Standard',
            color: item.color || variant?.color || 'Classic',
            quantity: item.quantity || 1,
            price: product.price,
            image: (item.image || (product.images ? JSON.parse(product.images)[0] : null)) || null,
          });
        }
      }
    } else {
      // Fetch from cartItems table
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true, variant: true },
      });

      if (cartItems.length > 0) {
        orderItemsToCreate = cartItems.map((ci) => ({
          productId: ci.productId,
          variantId: ci.variantId,
          productName: ci.product.name,
          size: ci.variant?.size || 'Standard',
          color: ci.variant?.color || 'Classic',
          quantity: ci.quantity,
          price: ci.product.price,
          image: ci.product.images ? JSON.parse(ci.product.images)[0] : null,
        }));
      }
    }

    if (orderItemsToCreate.length === 0) {
      res.status(400).json({ success: false, error: 'Cannot create order: bag is empty' });
      return;
    }

    // Calculate totals
    const subtotal = orderItemsToCreate.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 99900 ? 0 : 9900; // Free shipping over ₹999

    // Check discount coupon (e.g., DEVOTION500 gives ₹500 off, KANHA10 gives 10%)
    let discountPaise = 0;
    if (couponCode) {
      const code = String(couponCode).toUpperCase().trim();
      if (code === 'DEVOTION500') {
        discountPaise = 50000; // ₹500
      } else if (code === 'KANHA10') {
        discountPaise = Math.round(subtotal * 0.1);
      }
    }

    const total = Math.max(0, subtotal + shipping - discountPaise);

    // KAN-10291 format requested by user
    const randomOrderNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `KAN-${randomOrderNum}`;

    // Execute order creation & stock decrement inside transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId!,
          addressId: finalAddressId,
          subtotal,
          shipping,
          total,
          paymentMethod,
          status: 'CONFIRMED',
          notes: notes ? `${notes} (Coupon: ${couponCode || 'None'})` : `Coupon: ${couponCode || 'None'}`,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });

      // Clear cart items for this user
      await tx.cartItem.deleteMany({ where: { userId: userId! } });

      // Atomically decrement stock
      for (const item of orderItemsToCreate) {
        if (item.variantId) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Failed to place order' });
  }
});

// GET /api/orders — user's order history
ordersRouter.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id — get order by id or orderNumber
ordersRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});
