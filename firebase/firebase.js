// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBqumqEU_uBHoL72N88V0hacIO6S1XX8iI",
  authDomain: "waggle-baggle-5a709.firebaseapp.com",
  databaseURL: "https://waggle-baggle-5a709-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "waggle-baggle-5a709",
  storageBucket: "waggle-baggle-5a709.firebasestorage.app",
  messagingSenderId: "582833115978",
  appId: "1:582833115978:web:fa7e6b2dc2ccd3bef527b3"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

/*
  🔥 다중 사용자 지원 updateSeat
  - 특정 좌석만 업데이트
  - 다른 좌석은 건드리지 않음
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