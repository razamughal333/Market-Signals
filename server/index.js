require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const cron = require('node-cron');
const { Server } = require('socket.io');

const assetsRouter = require('./routes/assets');
const searchRouter = require('./routes/search');
const exploreRouter = require('./routes/explore');
const cache = require('./services/cache');
const { refreshAll } = require('./services/refresh');
const { connectDB } = require('./services/db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // fine for a portfolio project; tighten this if it ever handles real user data
});

app.use('/api/assets', assetsRouter);
app.use('/api/search', searchRouter);
app.use('/api/explore', exploreRouter);

app.get('/', (req, res) => {
  res.send('Market Signals API is running');
});

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  // send whatever we already have immediately, so the client doesn't wait for the next cron tick
  socket.emit('assets:update', await cache.getAll());
});

const PORT = process.env.PORT || 5000;

async function refreshAndBroadcast() {
  console.log('Refreshing asset data...');
  await refreshAll();
  io.emit('assets:update', await cache.getAll());
}

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  if (!process.env.TWELVE_DATA_API_KEY) {
    console.warn('WARNING: TWELVE_DATA_API_KEY is missing from .env — data fetches will fail.');
  }

  await connectDB(); // safe to call even if MONGODB_URI isn't set yet — falls back to memory
  await refreshAndBroadcast(); // populate cache immediately on startup
  cron.schedule('*/5 * * * *', refreshAndBroadcast); // then every 5 minutes
});
