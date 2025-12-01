module.exports = (prisma) => {
  const express = require('express');
  const router = express.Router();
  const jwt = require('jsonwebtoken');

  router.post('/signup', async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name } });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  });

  router.post('/login-demo', async (req, res) => {
    const { role = 'fan' } = req.body;
    const name = role === 'fan' ? 'Demo Fan' : 'Demo Creator';
    const user = await prisma.user.create({
      data: {
        email: `${role}@secretys.demo`,
        name,
        role
      }
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ ok: true, user, token });
  });

  return router;
};
