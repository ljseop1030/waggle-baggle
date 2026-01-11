import { handleSeatDetected, handleSeatLost } from './seatController'; 

const MY_USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);
let rssiHistory = [];
let lastSeat = null;

/**
 * 🚨 [긴급 수정] 강제 좌석 매핑 로직
 * - 거리 계산(m) 결과와 상관없이, 들어오는 신호 강도(RSSI) 자체로 좌석을 때려 박습니다.
 * - null을 절대 반환하지 않으므로, 연결만 되어 있으면 무조건 DB가 업데이트됩니다.
 */
export function mappingSeat(avgRssi) {
    // 1. 신호가 매우 강할 때 (-32 같은 값) -> Seat 1
    if (avgRssi > -60) {
        return "seat1"; 
    }
    
    // 2. 신호가 중간 정도일 때 -> Seat 2
    if (avgRssi > -85) {
        return "seat2"; 
    }
    
    // 3. 신호가 약하거나 57m 처럼 멀리 잡힐 때 -> 무조건 Seat 3
    // (기존에는 여기서 null을 반환해서 DB가 안 바뀌었을 겁니다)
    return "seat3"; 
}

/**
 * processSignal은 그대로 유지하되 로그만 강화
 */
export async function processSignal(rawRssi) {
    rssiHistory.push(rawRssi);
    
    // 반응 속도를 높이기 위해 평균 내는 샘플 수를 5개 -> 3개로 줄임
    if (rssiHistory.length > 3) {
        rssiHistory.shift();
    }

    const sum = rssiHistory.reduce((a, b) => a + b, 0);
    const average = sum / rssiHistory.length;
    
    // 위에서 수정한 무조건 반환 로직을 태웁니다.
    const seatId = mappingSeat(average);

    console.log(`🧪 테스트 모드 | 입력RSSI: ${rawRssi} | 판정: ${seatId} (DB 업데이트 시도)`);

    // 좌석 변경 감지 시 DB 업데이트
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