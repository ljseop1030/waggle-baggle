// [경로 수정] 같은 src 폴더 내에 있으므로 ./ 로 경로를 변경합니다
import { handleSeatDetected, handleSeatLost } from './seatController'; 
import { updateSeat, clearSeat } from './firebase'; 

const MY_USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

let rssiHistory = []; // 최근 5개 데이터를 담을 배열

/**
 * RSSI 평균값을 받아 좌석 번호(Zone)를 반환하는 함수
 */
export function mappingSeat(avgRssi) {
    if (avgRssi > -60) return "seat1";        // 매우 강함
    if (avgRssi > -75) return "seat2";        // 보통
    if (avgRssi > -90) return "seat3";        // 약함
    return null;                               // 신호 없음
}

/**
 * 신호 데이터 정제(Smoothing) 및 판정 실행 함수
 */
export async function processSignal(rawRssi) {
    // 1. 새로운 데이터를 배열에 추가 
    rssiHistory.push(rawRssi);

    // 2. 최근 5개만 유지 (Queue 구조)
    if (rssiHistory.length > 5) {
        rssiHistory.shift();
    }

    // 3. 최근 5개 데이터의 평균 계산
    const sum = rssiHistory.reduce((a, b) => a + b, 0);
    const average = sum / rssiHistory.length;

    // 4. 평균값으로 좌석 판정
    const seatId = mappingSeat(average);

    console.log(`📡 입력: ${rawRssi} | 📊 평균: ${average.toFixed(1)} | 📍 판정: ${seatId}`);

    // 5. 서버 업데이트 (웹 환경에 맞게 비동기 처리)
    if (seatId) {
        // 좌석이 감지되면 서버에 알림
        await handleSeatDetected(seatId, MY_USER_ID);
    } else {
        // 좌석에서 벗어나면 서버 상태 초기화
        await handleSeatLost();
    }

    return seatId;
}

// =================================================================
// 🧪 테스트 함수들 (로컬 실행용)
// =================================================================

/**
 * Sleep 유틸리티 함수
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 🎬 시나리오 기반 테스트
 */
export async function scenarioTest() {
    console.log("🎬 시나리오 테스트 시작!\n");

    const alice = 'user_alice';
    const bob = 'user_bob';
    const charlie = 'user_charlie';

    console.log("📖 Scene 1: Alice 도착 (seat1)");
    await updateSeat('seat1', alice);
    await sleep(3000);

    console.log("\n📖 Scene 2: Bob 도착 (seat2)");
    await updateSeat('seat2', bob);
    await sleep(3000);

    console.log("\n📖 Scene 3: Charlie 도착 (seat3)");
    await updateSeat('seat3', charlie);
    await sleep(3000);

    console.log("\n📖 Scene 4: Bob 떠남 (점심시간)");
    await clearSeat('seat2');
    await sleep(3000);

    console.log("\n✅ 시나리오 테스트 완료!");
}

// 웹 환경에서는 터미널이 아닌 브라우저에서 실행되므로 자동 실행은 주석 처리합니다.
// scenarioTest();