// seatController.js
import { updateSeat, clearSeat } from "./firebase";

let lastSeat = null;
let lastUpdateTime = 0;

// seat가 감지될 때마다 이 함수만 호출하면 됨
export async function handleSeatDetected(currentSeat, myUUID) {
  if (!currentSeat) return;

  // 같은 seat면 무시 (중복 감지 방지)
  if (lastSeat === currentSeat) return;

  // 너무 빠른 연속 감지 방지 (1초)
  const now = Date.now();
  if (now - lastUpdateTime < 1000) return;
  lastUpdateTime = now;

  try {
    // 순서 바꾸기: 새 좌석 먼저 점유
    await updateSeat(currentSeat, myUUID);
    
    // 성공하면 이전 좌석 비우기
    if (lastSeat) {
      await clearSeat(lastSeat).catch(e => 
        console.warn('⚠️ 이전 좌석 정리 실패:', e)
      );
    }
    
    lastSeat = currentSeat;
  } catch (error) {
    console.error('❌ 좌석 점유 실패:', error);
  }
}


// seatController.js (아래에 추가)
export async function handleSeatLost() {
  if (!lastSeat) return;

  try {
    await clearSeat(lastSeat);
    lastSeat = null;
  } catch (error) {
    console.error('❌ 좌석 비우기 실패:', error);
    // 실패해도 상태는 초기화 (다음 감지를 위해)
    lastSeat = null;
  }
}
