import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { AssetsMap } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Connects to the backend's Socket.io server and keeps `assets` in sync
 * whenever the server broadcasts a fresh "assets:update" (every 5 min, or
 * immediately on connect). Falls back gracefully — the initial REST fetch
 * (fetchAssets) still works even if the socket takes a moment to connect.
 */
export function useAssetsSocket() {
  const [assets, setAssets] = useState<AssetsMap | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('assets:update', (data: AssetsMap) => setAssets(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  return { assets, connected };
}
