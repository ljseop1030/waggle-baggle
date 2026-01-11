// App.tsx
import { useState } from 'react';
import { MapScreen } from './components/MapScreen';
import { SeatLayoutScreen } from './components/SeatLayoutScreen';
import { SearchScreen } from './components/SearchScreen';
import { BottomNav } from './components/BottomNav';
import { ProfileScreen } from './components/ProfileScreen';
import { processSignal } from './BeaconLogic';

export type Screen = 'map' | 'search' | 'profile' | 'wagleLounge' | 'frontierHall';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [isScanning, setIsScanning] = useState(false);
  const [mySeat, setMySeat] = useState<string | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);

  // ✅ 실제 비콘 거리 측정 로직
  const startBeaconScan = async () => {
    try {
      const nav = navigator as any;
      if (!nav.bluetooth) {
        alert("크롬 브라우저를 사용해 주세요!");
        return;
      }

      // ✅ 실제 비콘 연결 (UUID는 iOS Beacon Simulator 설정과 맞춰야 함)
      const device = await nav.bluetooth.requestDevice({
          filters: [{
          services: ['ee673c60-0c2e-4ed2-bfe1-229ecf94f76a'] // 소문자로 변환
        }]
      });

      const server = await device.gatt.connect();
      setIsScanning(true);

      // ✅ 주기적으로 RSSI 측정
      const scanInterval = setInterval(async () => {
        if (device.gatt?.connected) {
          try {
            // ✅ 실제 RSSI 값 가져오기
            const rssi = device.rssi || -100;
            
            // BeaconLogic으로 처리 (거리 계산 + 좌석 판정 + DB 업데이트)
            const seatId = await processSignal(rssi);
            
            // UI 업데이트
            setMySeat(seatId);
            setCurrentDistance(calculateDistance(rssi));
            
            console.log(`📡 RSSI: ${rssi} | 거리: ${calculateDistance(rssi).toFixed(2)}m | 좌석: ${seatId}`);
            
          } catch (error) {
            console.error('RSSI 측정 실패:', error);
          }
        } else {
          // 연결 끊김
          clearInterval(scanInterval);
          setIsScanning(false);
          setMySeat(null);
        }
      }, 2000); // 2초마다 측정

    } catch (error) {
      console.error("비콘 연결 에러:", error);
      alert("비콘 연결 실패. 다시 시도해주세요.");
    }
  };

  // ✅ RSSI → 거리 변환 함수
  const calculateDistance = (rssi: number): number => {
    const txPower = -59; // 1m 거리의 RSSI 기준값 (조정 필요)
    if (rssi === 0) return -1.0;
    
    const ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'map':
        return <MapScreen onLocationClick={setCurrentScreen} />;
      case 'wagleLounge':
        return (
          <SeatLayoutScreen
            locationName="별관도서관 와글와글실"
            status={mySeat ? "이용 중" : "여유"}
            statusColor={mySeat ? "red" : "green"}
            occupancyRate={0.83}
            onBack={() => setCurrentScreen('map')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'frontierHall':
        return (
          <SeatLayoutScreen
            locationName="프론티어관 204호"
            status="여유"
            statusColor="green"
            occupancyRate={0.33}
            totalSeats={3}
            onBack={() => setCurrentScreen('map')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'search':
        return <SearchScreen onLocationClick={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <MapScreen onLocationClick={setCurrentScreen} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-b from-slate-50 to-gray-50 flex flex-col overflow-hidden">
      {/* ✅ 상단 비콘 상태 표시 (거리 정보 추가) */}
      <div className="p-2 bg-white border-b flex justify-between items-center px-4">
        <span className="text-[10px] font-bold text-slate-400">WAGLE BAGGLE</span>
        <div className="flex gap-2 items-center">
          {currentDistance !== null && (
            <span className="text-[10px] text-gray-600">
              📍 {currentDistance.toFixed(1)}m
            </span>
          )}
          <button 
            onClick={startBeaconScan}
            className={`text-[10px] px-3 py-1 rounded-full text-white transition-all ${
              isScanning ? 'bg-blue-600' : 'bg-slate-800'
            }`}
          >
            {isScanning ? `📡 ${mySeat || '감지 중'}` : '🔗 비콘 연결'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>
      
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}