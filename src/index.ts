import express from 'express';
import bodyParser from 'body-parser';
import employeeRoutes from './routes/employeeRoutes';
import salaryDetailsRouter from './routes/salaryDetailsRouter';
import salarySlipRoutes from './routes/salarySlipRoutes';
import leaveManagementRoutes from './routes/leaveManagementRoutes';
import socialInsuranceCalculationRoutes from './routes/SocialInsuranceCalculationRoutes';
import monthlyRemunerationRoutes from './routes/monthlyRemunerationRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

// Middleware
app.use(cors(corsOptions)); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorMiddleware);

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/salary-details', salaryDetailsRouter);
app.use('/api/salary-slip', salarySlipRoutes);
app.use('/api/leave-management', leaveManagementRoutes);
app.use('/api/social-insurance-calculation', socialInsuranceCalculationRoutes);
app.use('/api/monthly-remuneration', monthlyRemunerationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;