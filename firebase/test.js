import { updateSeat } from './firebase.js';

async function testUpdateSeat() {
  console.log('테스트 시작...');
  
  // seat1에 앉기
  await updateSeat('seat1', 'test-user-123');
  
  // 2초 후 seat4로 이동
  setTimeout(async () => {
    await updateSeat('seat4', 'test-user-123');
  }, 2000);
  
  // 4초 후 seat6로 이동
  setTimeout(async () => {
    await updateSeat('seat6', 'test-user-123');
  }, 4000);
}

testUpdateSeat();