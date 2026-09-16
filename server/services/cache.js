// Deliberately simple: an in-memory object, not a database.
// Data refreshes every few minutes anyway, so losing it on server restart is fine —
// the next refresh cycle just repopulates it. This is the "go light on the database"
// approach — add MongoDB later only if you want history/backtesting beyond this session.

let store = {};

function setAsset(id, data) {
  store[id] = { ...data, updatedAt: new Date().toISOString() };
}

function getAsset(id) {
  return store[id];
}

function getAll() {
  return store;
}

module.exports = { setAsset, getAsset, getAll };
