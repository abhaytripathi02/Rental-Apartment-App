// ESmodule support in Node.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

// commonjs support in Node.js
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const morgan = require('morgan');

/* ROUTE IMPORT */
import applicationRoutes from './routes/application.routes.js';
import propertyRoutes from './routes/property.routes.js';
import leaseRoutes from './routes/lease.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import managerRoutes from './routes/manager.routes.js';

import { authMiddleware } from './middleware/auth.middleware.js';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));

/* ROUTES */
import type { Request, Response } from 'express';
app.get('/', (req: Request, res: Response) => {
  res.send('This is Home Route');
});

app.use("/applications", applicationRoutes);
app.use("/properties", propertyRoutes);
app.use("/leases", leaseRoutes);
app.use("/tenants",  authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleware(["manager"]), managerRoutes);

/* SERVER LISTEN*/
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});