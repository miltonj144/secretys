module.exports = (prisma, stripe) => {
  const express = require('express');
  const router = express.Router();

  router.post('/create-connected-account', async (req, res) => {
    const { creatorId, email } = req.body;
    if (!creatorId || !email) return res.status(400).json({ error: 'missing data' });

    try {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'BR',
        email
      });

      await prisma.creator.update({
        where: { id: creatorId },
        data: { stripeAccountId: account.id }
      });

      res.json({ ok: true, account });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/create-account-link', async (req, res) => {
    const { accountId, returnUrl } = req.body;
    if (!accountId) return res.status(400).json({ error: 'missing accountId' });

    try {
      const link = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: returnUrl || `${process.env.FRONTEND_URL}/stripe/retry`,
        return_url: returnUrl || `${process.env.FRONTEND_URL}/stripe/success`,
        type: 'account_onboarding'
      });
      res.json({ ok: true, url: link.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
