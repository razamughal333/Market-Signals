const mongoose = require('mongoose');
const Asset = require('../models/Asset');

// In-memory fallback — kept in sync on every write regardless of DB state,
// so reads are instant and the app still works if MongoDB is unreachable.
let memoryStore = {};

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

async function setAsset(id, data) {
  const payload = { ...data, id, updatedAt: new Date() };
  memoryStore[id] = payload;

  if (isDbConnected()) {
    try {
      await Asset.findOneAndUpdate({ id }, payload, { upsert: true, new: true });
    } catch (err) {
      console.error(`Failed to save ${id} to MongoDB: ${err.message}`);
    }
  }
}

async function getAsset(id) {
  if (isDbConnected()) {
    try {
      const doc = await Asset.findOne({ id }).lean();
      if (doc) return doc;
    } catch (err) {
      console.error(`Failed to read ${id} from MongoDB: ${err.message}`);
    }
  }
  return memoryStore[id];
}

async function getAll() {
  if (isDbConnected()) {
    try {
      const docs = await Asset.find({}).lean();
      if (docs.length > 0) {
        const map = {};
        docs.forEach((doc) => {
          map[doc.id] = doc;
        });
        return map;
      }
    } catch (err) {
      console.error(`Failed to read all assets from MongoDB: ${err.message}`);
    }
  }
  return memoryStore;
}

module.exports = { setAsset, getAsset, getAll };
