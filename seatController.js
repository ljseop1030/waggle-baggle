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

  // 이전 seat 정리
  if (lastSeat) {
    await clearSeat(lastSeat);
  }

  // 새 seat 점유
  await updateSeat(currentSeat, myUUID);

  lastSeat = currentSeat;
}


// seatController.js (아래에 추가)
export async function handleSeatLost() {
  if (!lastSeat) return;

  await clearSeat(lastSeat);
  lastSeat = null;
}
