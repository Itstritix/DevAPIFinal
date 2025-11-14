const express = require('express');
const { logger, requestLogger, consoleLogger } = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);
app.use(consoleLogger);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  logger.info(`Serveur démarré sur http://localhost:${PORT}`);
  logger.info('🚀 Serveur prêt!');
});