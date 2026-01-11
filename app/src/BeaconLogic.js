import { handleSeatDetected, handleSeatLost } from '../../firebase/seatController';
const MY_USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

let rssiHistory = []; // 최근 5개 데이터를 담을 배열 [cite: 33]

/**
 * RSSI 평균값을 받아 좌석 번호(Zone)를 반환하는 함수 [cite: 31]
 */
export function mappingSeat(avgRssi) {
    if (avgRssi > -60) return "seat_1";        // 매우 강함
    if (avgRssi > -75) return "seat_2";        // 보통
    if (avgRssi > -90) return "seat_3";        // 약함
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

// --- 🔑 테스트를 위한 실행 코드는 함수 바깥에 있어야 합니다! ---
function startTest() {
    console.log("🚀 와글바글 로직 테스트 시작 (1초마다 데이터 생성)");

    setInterval(() => {
        // -40 ~ -99 사이의 랜덤 RSSI 생성 [cite: 30]
        const randomRssi = Math.floor(Math.random() * (99 - 40 + 1)) * -1;
    
        // 우리가 만든 로직 함수 실행 
        processSignal(randomRssi);
    }, 1000);
}

// 파일을 실행하자마자 테스트가 시작되도록 호출합니다.
startTest();