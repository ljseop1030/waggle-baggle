// test.js - 2명이 동시에 사용하는 시나리오 (seat1~3만 존재)
import { handleSeatDetected, handleSeatLost } from './seatController.js';

async function multiUserTest() {
  console.log('🎬 2명 동시 사용 시나리오 테스트!\n');
  console.log('==============================================');
  
  // User A: seat1에 앉음
  console.log('👤 User A: seat1에 앉음');
  await handleSeatDetected('seat1', 'user-A');
  await sleep(2000);
  
  // User A: seat3으로 이동
  console.log('\n🔄 User A: seat1 → seat3 이동');
  await handleSeatDetected('seat3', 'user-A');
  await sleep(2000);
  
  // User A: 일어남
  console.log('\n🚶 User A: 자리에서 일어남');
  await handleSeatLost();
  await sleep(1000);
  
  // User B: seat2에 앉음 (User A가 없는 동안)
  console.log('\n👤 User B: seat2에 앉음');
  await handleSeatDetected('seat2', 'user-B');
  await sleep(2000);
  
  // User B: seat1로 이동 (User A가 비운 자리)
  console.log('\n🔄 User B: seat2 → seat1 이동');
  await handleSeatDetected('seat1', 'user-B');
  await sleep(2000);
  
  // User A: 다시 돌아와서 seat3에 앉음
  console.log('\n👤 User A: 다시 돌아옴 → seat3에 앉음');
  await handleSeatDetected('seat3', 'user-A');
  await sleep(2000);
  
  // 현재 상태: seat1(User B), seat3(User A)
  console.log('\n📊 현재 상태: seat1(User B), seat3(User A)');
  await sleep(2000);
  
  // 모두 퇴장
  console.log('\n👋 User B 퇴장');
  await handleSeatLost();
  await sleep(1000);
  
  console.log('👋 User A 퇴장');
  await handleSeatLost();
  
  console.log('\n==============================================');
  console.log('✅ 테스트 완료!');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

multiUserTest();