// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBqumqEU_uBHoL72N88V0hacIO6S1XX8iI",
  authDomain: "waggle-baggle-5a709.firebaseapp.com",
  databaseURL: "https://waggle-baggle-5a709-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "waggle-baggle-5a709",
  storageBucket: "waggle-baggle-5a709.firebasestorage.app",
  messagingSenderId: "582833115978",
  appId: "1:582833115978:web:fa7e6b2dc2ccd3bef527b3"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

/*
  seat 신호 업데이트
  - seat 중심 구조 유지
  - 감지된 seat만 변경
*/
export async function updateSeat(seatName, myUUID) {
  try {
    if (!seatName) return;

    const seatRef = ref(database, `seats/${seatName}`);

    await update(seatRef, {
      occupied: true,
      userId: myUUID,
      updatedAt: Date.now()
    });

    console.log(`📡 ${seatName} detected ${myUUID}`);
  } catch (error) {
    console.error('❌ 업데이트 실패:', error);
  }
}

export async function clearSeat(seatName) {
  try {
    const seatRef = ref(database, `seats/${seatName}`);

    await update(seatRef, {
      occupied: false,
      userId: "",
      updatedAt: Date.now()
    });

    console.log(`⚪ ${seatName} cleared`);
  } catch (error) {
    console.error('❌ 초기화 실패:', error);
  }
}
