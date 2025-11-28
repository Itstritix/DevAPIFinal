const express = require('express');
const { logger, requestLogger, consoleLogger } = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware'); 
const { dbConnect } = require('./config/database');
const authRouter = require('./routes/authRoute');
const dealRouter = require('./routes/dealRoute');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);
app.use(consoleLogger);

dbConnect;

app.use("/api/auth", authRouter);
app.use("/api/deals", dealRouter);


app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`);
  logger.info('🚀 Server ready!');
});