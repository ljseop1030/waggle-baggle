import { handleSeatDetected, handleSeatLost } from '../../firebase/seatController.js';
import { updateSeat, clearSeat } from '../../firebase/firebase.js';

const MY_USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

let rssiHistory = []; // 최근 5개 데이터를 담을 배열 [cite: 33]

/**
 * RSSI 평균값을 받아 좌석 번호(Zone)를 반환하는 함수 [cite: 31]
 */
export function mappingSeat(avgRssi) {
    if (avgRssi > -60) return "seat1";        // 매우 강함
    if (avgRssi > -75) return "seat2";        // 보통
    if (avgRssi > -90) return "seat3";        // 약함
    return null;                               // 신호 없음
}

/**
 * 신호 데이터 정제(Smoothing) 및 판정 실행 함수 [cite: 32]
 */
export async function processSignal(rawRssi) {
    // 1. 새로운 데이터를 배열에 추가 
    rssiHistory.push(rawRssi);

    // 2. 최근 5개만 유지 (Queue 구조) [cite: 34]
    if (rssiHistory.length > 5) {
        rssiHistory.shift();
    }

    // 3. 최근 5개 데이터의 평균 계산
    const sum = rssiHistory.reduce((a, b) => a + b, 0);
    const average = sum / rssiHistory.length;

    // 4. 평균값으로 좌석 판정 [cite: 35]
    const seatId = mappingSeat(average);

    console.log(`📡 입력: ${rawRssi} | 📊 평균: ${average.toFixed(1)} | 📍 판정: ${seatId}`);

    if (seatId) {
        await handleSeatDetected(seatId, MY_USER_ID);
    } else {
        await handleSeatLost();
    }

    return seatId;
}


// =================================================================
// 🧪 테스트 함수들
// =================================================================

/**
 * 기본 단일 사용자 랜덤 테스트
 */
async function startTest() {
    console.log("🚀 와글바글 로직 테스트 시작 (1초마다 데이터 생성)");
    console.log(`👤 내 ID: ${MY_USER_ID}`);

    setInterval(async () => {
        const randomRssi = Math.floor(Math.random() * (99 - 40 + 1)) * -1;
        await processSignal(randomRssi);
    }, 1000);
}

/**
 * 🎬 시나리오 기반 테스트
 */
async function scenarioTest() {
    console.log("🎬 시나리오 테스트 시작!\n");

    const alice = 'user_alice';
    const bob = 'user_bob';
    const charlie = 'user_charlie';

    // === 씬 1: 아침 9시, Alice만 도서관 도착 ===
    console.log("📖 Scene 1: Alice 도착 (seat1)");
    await updateSeat('seat1', alice);
    await sleep(3000);

    // === 씬 2: 10시, Bob 도착 ===
    console.log("\n📖 Scene 2: Bob 도착 (seat2)");
    await updateSeat('seat2', bob);
    await sleep(3000);

    // === 씬 3: 11시, Charlie 도착 ===
    console.log("\n📖 Scene 3: Charlie 도착 (seat3)");
    await updateSeat('seat3', charlie);
    await sleep(3000);

    // === 씬 4: 12시, Bob 점심 먹으러 떠남 ===
    console.log("\n📖 Scene 4: Bob 떠남 (점심시간)");
    await clearSeat('seat2');
    await sleep(3000);

    // === 씬 5: 1시, Alice도 자리 이동 (seat2로) ===
    console.log("\n📖 Scene 5: Alice가 seat2로 이동");
    await clearSeat('seat1');
    await updateSeat('seat2', alice);
    await sleep(3000);

    // === 씬 6: 2시, 모두 떠남 ===
    console.log("\n📖 Scene 6: 모두 떠남");
    await clearSeat('seat2');
    await clearSeat('seat3');

    console.log("\n✅ 시나리오 테스트 완료!");
}

/**
 * Sleep 유틸리티 함수
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =================================================================
// 🎯 실행할 테스트 선택 (하나만 주석 해제!)
// =================================================================


scenarioTest();     // 시나리오 테스트 ✅
//startTest();