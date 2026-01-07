// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Firebase 설정 (나중에 채워야 함!)
// Your web app's Firebase configuration - firebase에서 만든 테스트용 웹 정보 복사해둠
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
const database = getDatabase(app);

// updateSeat 함수
export async function updateSeat(seatName, myUUID) {
  try {
    // 1. 모든 좌석을 false로 초기화
    const seats = {
      seat1: { occupied: false, userId: "" },
      seat2: { occupied: false, userId: "" },
      seat3: { occupied: false, userId: "" },
      seat4: { occupied: false, userId: "" },  // 추가
      seat5: { occupied: false, userId: "" },  // 추가
      seat6: { occupied: false, userId: "" }   // 추가
    };
    
    // 2. 내가 앉은 좌석만 true로 변경
    if (seats[seatName]) {
      seats[seatName].occupied = true;
      seats[seatName].userId = myUUID;
    }
    
    // 3. Firebase에 업데이트
    const seatsRef = ref(database, 'seats');
    await set(seatsRef, seats);
    
    console.log(`✅ ${seatName}에 앉았습니다!`);
  } catch (error) {
    console.error('❌ 업데이트 실패:', error);
  }
}

// 테스트 함수
export async function testUpdateSeat() {
  console.log('테스트 시작...');
  
  // seat2에 앉기
  await updateSeat('seat2', 'test-user-123');
  
  // 2초 후 seat1로 이동
  setTimeout(async () => {
    await updateSeat('seat1', 'test-user-123');
  }, 2000);
  
  // 4초 후 seat3로 이동
  setTimeout(async () => {
    await updateSeat('seat3', 'test-user-123');
  }, 4000);
}