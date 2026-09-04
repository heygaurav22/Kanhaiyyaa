import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

export const addressesRouter = Router();

addressesRouter.use(authenticateToken);

// GET /api/addresses
addressesRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch addresses' });
  }
});

// POST /api/addresses
addressesRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { label, line1, line2, city, state, postcode, phone } = req.body;

    if (!line1 || !city || !state || !postcode || !phone) {
      res.status(400).json({
        success: false,
        error: 'Line 1, city, state, postcode, and phone are required',
      });
      return;
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        label,
        line1,
        line2,
        city,
        state,
        postcode,
        phone,
        country: 'India',
      },
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ success: false, error: 'Failed to save address' });
  }
});

// DELETE /api/addresses/:id
addressesRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const address = await prisma.address.findUnique({ where: { id: req.params.id } });

    if (!address || address.userId !== req.user!.id) {
      res.status(404).json({ success: false, error: 'Address not found' });
      return;
    }

    await prisma.address.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete address' });
  }
});
