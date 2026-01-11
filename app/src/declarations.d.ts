// src/declarations.d.ts
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module 'lucide-react';
declare module 'firebase/database';
declare module './firebase' {
  export const database: any;
  export function updateSeat(seatName: string, myUUID: string): Promise<void>;
  export function clearSeat(seatName: string): Promise<void>;
}