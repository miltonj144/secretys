const bodyParser = require('body-parser');

module.exports = (prisma, stripe) => {
  const express = require('express');
  const router = express.Router();

  router.post('/create-checkout-session', async (req, res) => {
    const { creatorHandle, userId } = req.body;
    if (!creatorHandle || !userId) return res.status(400).json({ error: 'missing data' });

    const creator = await prisma.creator.findUnique({ where: { handle: creatorHandle } });
    if (!creator) return res.status(404).json({ error: 'creator not found' });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          price_data: {
            currency: 'brl',
            product_data: { name: `Assinatura ${creator.name}` },
            unit_amount: Math.round(creator.price * 100),
            recurring: { interval: 'month' }
          },
          quantity: 1
        }],
        success_url: `${process.env.FRONTEND_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payments/cancel`,
        metadata: { creatorHandle, userId }
      });
      res.json({ url: session.url, id: session.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log('Webhook signature failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { creatorHandle, userId } = session.metadata || {};
      if (creatorHandle && userId) {
        try {
          const creator = await prisma.creator.findUnique({ where: { handle: creatorHandle } });
          if (creator) {
            await prisma.user.update({
              where: { id: userId },
              data: { subscriptions: { push: creator.id } }
            });
            await prisma.creator.update({
              where: { id: creator.id },
              data: { subscribers: { increment: 1 } }
            });
          }
        } catch (e) { console.error(e); }
      }
    }

    res.json({ received: true });
  });

  return router;
};
