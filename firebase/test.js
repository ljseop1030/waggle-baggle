// test.js - 2명이 동시에 사용하는 시나리오
import { updateSeat } from './firebase.js';

async function multiUserTest() {
  console.log('🎬 2명 동시 사용 시나리오 테스트!\n');
  console.log('==============================================');
  
  // User A: seat1에 앉음
  console.log('👤 User A: seat1에 앉음');
  await updateSeat('seat1', 'user-A');
  await sleep(2000);
  
  // User A: seat3으로 이동
  console.log('\n🔄 User A: seat1 → seat3 이동');
  await updateSeat('seat3', 'user-A');
  await sleep(2000);
  
  // User A: 일어남
  console.log('\n🚶 User A: 자리에서 일어남');
  await updateSeat('waiting', 'user-A');
  await sleep(1000);
  
  // User B: seat2에 앉음 (User A가 없는 동안)
  console.log('\n👤 User B: seat2에 앉음');
  await updateSeat('seat2', 'user-B');
  await sleep(2000);
  
  // User B: seat5로 이동
  console.log('\n🔄 User B: seat2 → seat5 이동');
  await updateSeat('seat5', 'user-B');
  await sleep(2000);
  
  // User A: 다시 돌아와서 seat6에 앉음
  console.log('\n👤 User A: 다시 돌아옴 → seat6에 앉음');
  await updateSeat('seat6', 'user-A');
  await sleep(2000);
  
  // 현재 상태: seat5(User B), seat6(User A)
  console.log('\n📊 현재 상태: seat5(User B), seat6(User A)');
  await sleep(2000);
  
  // 모두 퇴장
  console.log('\n👋 User B 퇴장');
  await updateSeat('waiting', 'user-B');
  await sleep(1000);
  
  console.log('👋 User A 퇴장');
  await updateSeat('waiting', 'user-A');
  
  console.log('\n==============================================');
  console.log('✅ 테스트 완료!');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

multiUserTest();