module.exports = (prisma) => {
  const express = require('express');
  const router = express.Router();

  // list creators
  router.get('/', async (req, res) => {
    const list = await prisma.creator.findMany();
    res.json(list);
  });

  // creator details
  router.get('/:handle', async (req, res) => {
    const c = await prisma.creator.findUnique({ where: { handle: req.params.handle } });
    if (!c) return res.status(404).json({ error: 'not found' });
    res.json(c);
  });

  return router;
};
