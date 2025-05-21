require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes/authRoute');
const pestRoutes=require('./routes/pestDisease.routes')
const connectDB = require('./config/config');

const app = express();
app.use(express.json());
connectDB();
// Trust proxy (useful for Heroku/NGINX)
app.set('trust proxy', 1);

// Force HTTPS in production
// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect('https://' + req.headers.host + req.url);
//   }
//   next();
// });

// Helmet for HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Consider enabling this with a custom config later
}));

// CORS config
app.use(cors({
  origin: ['https://farmapp.in', 'http://localhost:8000','http://localhost:5173', 'http://localhost:5174','https://farmin-system.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    status: 429,
    message: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: 'Too many login attempts. Please try again after 24 hours.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply limiters
app.use((req, res, next) => {
  if (req.path === '/api/login') return next();
  generalLimiter(req, res, next);
});
app.use('/api/login', loginLimiter, (req,res)=>{
  res.send('login attemt')
});

// Body parsers with size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
// app.use(express.json());
// app.use(express.urlencoded());

// Sanitize inputs
// app.use(mongoSanitize());
// app.use(xss());

// Disable x-powered-by
app.disable('x-powered-by');

// Routes
app.get('/', (req,res)=>{
  res.send('this Is Home Page')
});
app.use('/api/v1/web', routes);

app.use('/api/v1/web', pestRoutes)

// 404 Handler (always last route)
// app.all('*', (req, res) => {
//   res.status(404).json({
//     status: 404,
//     message: 'Route not found'
//   });
// });

// Global error handler (after all)
app.use((err, req, res, next) => {
  console.error(' Server Error:', err.stack);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error. Please try again later.'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on ${PORT}`);
});
