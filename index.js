const express = require('express');
const { logger, requestLogger, consoleLogger } = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware'); 
const { dbConnect } = require('./config/database');
const authRouter = require('./routes/authRoute');
const dealRouter = require('./routes/dealRoute');
const commentRouter = require('./routes/commentRoute');
const adminRouter = require('./routes/adminRoute');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);
app.use(consoleLogger);

dbConnect;

app.use("/api/auth", authRouter);
app.use("/api/deals", dealRouter);
app.use("/api/deals", commentRouter);
app.use("/api/comment", commentRouter);
app.use("/api/admin", adminRouter);



app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`);
  logger.info('🚀 Server ready!');
});