import { useState } from 'react';
import { MapScreen } from './components/MapScreen';
import { SeatLayoutScreen } from './components/SeatLayoutScreen';
import { SearchScreen } from './components/SearchScreen';
import { BottomNav } from './components/BottomNav';
import { ProfileScreen } from './components/ProfileScreen';

// [경로 수정 완료] 같은 src 폴더 내에 있으므로 ./ 로 불러옵니다
import { processSignal } from './BeaconLogic'; 
import { updateSeat } from './firebase'; // 팀원 B의 서버 업데이트 함수

export type Screen = 'map' | 'search' | 'profile' | 'wagleLounge' | 'frontierHall';

export default function App() {
  // 1. 상태 정의
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [isScanning, setIsScanning] = useState(false);
  const [mySeat, setMySeat] = useState<string | null>(null);

  // 2. 비콘 스캔 및 서버 전송 로직
  const startBeaconScan = async () => {
    try {
      const nav = navigator as any; 
      if (!nav.bluetooth) {
        alert("크롬 브라우저를 사용해 주세요!");
        return;
      }

      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });

      setIsScanning(true);
      
      let lastSentSeat: string | null = null; // 중복 전송 방지용

      setInterval(async() => {
        if (device.gatt?.connected) {
          // 실제 RSSI 데이터를 로직에 투입
          const mockRssi = Math.floor(Math.random() * (99 - 40 + 1)) * -1;
          const seatId: string | null = await processSignal(mockRssi); 
          setMySeat(seatId);

          // [서버 합체] 좌석이 바뀌었을 때만 Firebase에 업데이트 요청
          if (seatId && seatId !== lastSentSeat) {
            updateSeat(seatId, "User_HyangHee"); 
            lastSentSeat = seatId;
            
            console.log(`📡 서버로 좌석 정보 전송: ${seatId}`);
          }
        }
      }, 1000);
    } catch (error) {
      console.error("비콘 연결 에러:", error);
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
            // 내 좌석 상태에 따라 실시간 UI 반영
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
      {/* 📡 상단 비콘 상태 표시 바 */}
      <div className="p-2 bg-white border-b flex justify-between items-center px-4">
        <span className="text-[10px] font-bold text-slate-400">WAGLE BAGGLE</span>
        <button 
          onClick={startBeaconScan}
          className={`text-[10px] px-3 py-1 rounded-full text-white transition-all ${
            isScanning ? 'bg-blue-600' : 'bg-slate-800'
          }`}
        >
          {isScanning ? `📡 ${mySeat || '감지 중'}` : '🔗 비콘 연결'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>
      
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}