import { handleSeatDetected, handleSeatLost } from './seatController'; 

const MY_USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);
let rssiHistory = [];
let lastSeat = null; // ✅ 추가: 이전 좌석 추적

/**
 * RSSI 평균값으로 좌석 판정 (비콘 1개, 거리별 구분)
 */
export function mappingSeat(avgRssi) {
    if (avgRssi > -60) return "seat1";  // 0~1m
    if (avgRssi > -75) return "seat2";  // 1~2m
    if (avgRssi > -90) return "seat3";  // 2~3m
    return null;                        // 3m 이상
}

/**
 * RSSI 데이터 평활화 + 좌석 판정 + DB 업데이트
 */
export async function processSignal(rawRssi) {
    rssiHistory.push(rawRssi);
    if (rssiHistory.length > 5) {
        rssiHistory.shift();
    }

    const sum = rssiHistory.reduce((a, b) => a + b, 0);
    const average = sum / rssiHistory.length;
    const seatId = mappingSeat(average);

    console.log(`📡 입력: ${rawRssi} | 📊 평균: ${average.toFixed(1)} | 📍 판정: ${seatId}`);

    // ✅ 좌석이 바뀌었을 때만 업데이트
    if (seatId !== lastSeat) {
        if (seatId) {
            await handleSeatDetected(seatId, MY_USER_ID);
        } else {
            await handleSeatLost();
        }
        lastSeat = seatId;
    }

    return seatId;
}