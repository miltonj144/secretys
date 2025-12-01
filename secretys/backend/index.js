require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const authRoutes = require('./routes/auth');
const creatorsRoutes = require('./routes/creators');
const uploadsRoutes = require('./routes/uploads');
const paymentsRoutes = require('./routes/payments');
const paymentsConnectRoutes = require('./routes/payments_connect');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes(prisma));
app.use('/api/creators', creatorsRoutes(prisma));
app.use('/api/uploads', uploadsRoutes());
app.use('/api/payments', paymentsRoutes(prisma, stripe));
app.use('/api/payments-connect', paymentsConnectRoutes(prisma, stripe));

app.get('/', (req, res) => res.send('Secretys backend OK'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Backend running on port', port));
