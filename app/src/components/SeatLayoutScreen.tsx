import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { DragonCharacter } from './DragonCharacter';
import { FullRoomPopup } from './FullRoomPopup';
import { Screen } from '../App';
import { database } from '../../firebase/firebase'; 
import { ref, onValue } from 'firebase/database';

interface SeatLayoutScreenProps {
  locationName: string;
  status: string;
  statusColor: 'green' | 'yellow' | 'red';
  occupancyRate: number;
  totalSeats?: number;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export function SeatLayoutScreen({
  locationName,
  onBack,
  onNavigate,
}: SeatLayoutScreenProps) {
  const [firebaseSeats, setFirebaseSeats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 현재 이 화면이 204호인지 확인
  const isFrontier204 = locationName.includes('204호');

  useEffect(() => {
    // 204호일 때만 Firebase의 'seats' 경로에서 실시간 데이터를 가져옵니다.
    // (팀원 A가 'seats' 아래에 seat_1, seat_2, seat_3를 저장하기로 약속했기 때문)
    if (isFrontier204) {
      const seatsRef = ref(database, 'seats');
      const unsubscribe = onValue(seatsRef, (snapshot: any) => {
        const data = snapshot.val();
        if (data) {
          setFirebaseSeats(data);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false); // 와글와글실은 연동이 필요 없으므로 바로 로딩 완료
    }
  }, [isFrontier204]);

  // --- 데이터 설정 로직 ---
  let displaySeats: any[] = [];
  let currentOccupancyRate = 0;

  if (!isFrontier204) {
    // 1. 와글와글실: 연동 없이 무조건 48석 고정 (혼잡 상태 유지)
    const totalWagle = 48;
    const occupiedWagle = 40; 
    currentOccupancyRate = occupiedWagle / totalWagle;
    displaySeats = Array.from({ length: totalWagle }).map((_, i) => ({
      id: `wagle-${i}`,
      occupied: i < occupiedWagle
    }));
  } else {
    // 2. 204호: 팀원 A의 데이터 구조(seat_1, seat_2, seat_3)와 실시간 연동
    const totalFrontier = 3;
    const targetKeys = ['seat_1', 'seat_2', 'seat_3']; // 팀원 A의 리턴값과 일치
    
    displaySeats = targetKeys.map((key) => ({
      id: key,
      occupied: firebaseSeats[key]?.occupied || false
    }));

    const occupiedCount = displaySeats.filter(seat => seat.occupied).length;
    currentOccupancyRate = occupiedCount / totalFrontier;
  }

  const [showPopup, setShowPopup] = useState(false);

  // 혼잡도 80% 이상일 때 팝업
  useEffect(() => {
    if (currentOccupancyRate >= 0.8) {
      setShowPopup(true);
    }
  }, [currentOccupancyRate]);

  const getStatusInfo = (rate: number) => {
    if (rate < 0.4) return { text: '여유', color: '#10B981' };
    if (rate < 0.8) return { text: '보통', color: '#FBBF24' };
    return { text: '혼잡', color: '#EF4444' };
  };

  const statusInfo = getStatusInfo(currentOccupancyRate);

  if (loading) return <div className="h-full flex items-center justify-center">좌석을 찾고 있어용!</div>;

  return (
    <div className="h-full flex flex-col bg-[#F8F9FD]">
      {/* Header (생략 - 기존 UI 유지) */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="w-full flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>
          <h2 className="font-bold text-lg">{locationName}</h2>
          <button onClick={() => setRefreshing(true)} className={refreshing ? "animate-spin" : ""}><RefreshCw size={20}/></button>
        </div>
        <div className="w-full px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm" style={{ color: statusInfo.color }}>{statusInfo.text}</span>
            <span className="text-gray-600 text-sm font-semibold">{Math.floor(currentOccupancyRate * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ 
                width: `${currentOccupancyRate * 100}%`,
                backgroundColor: statusInfo.color 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Seat Map Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h3 className="text-gray-500 text-sm font-bold mb-8 text-center uppercase tracking-wider">좌석 배치도</h3>
          <div className="perspective-[1200px] flex justify-center items-center">
            <div
              className="grid gap-x-3 gap-y-4 justify-items-center"
              style={{
                // 204호면 3열 가로 배치, 와글와글이면 8열 배치
                gridTemplateColumns: isFrontier204 ? `repeat(3, 32px)` : `repeat(8, 32px)`,
                transform: "rotateX(25deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {displaySeats.map((seat) => (
                <div key={seat.id} className="w-8 h-10 relative" style={{ transformStyle: "preserve-3d" }}>
                   {/* 좌석 그림자/바닥 */}
                   <div className={`absolute inset-0 rounded-md shadow-sm ${seat.occupied ? 'bg-gray-300' : 'bg-gray-100'}`} />
                   {/* 좌석 본체 (입체 효과) */}
                   <div
                     className={`absolute inset-0 rounded-md border flex items-center justify-center shadow-md 
                     ${seat.occupied ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-100'}`}
                     style={{ transform: `translateZ(${seat.occupied ? '6px' : '4px'})` }}
                   />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8">
             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-gray-200 rounded shadow-sm"></div><span className="text-xs text-gray-500">빈 좌석</span></div>
             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded shadow-sm"></div><span className="text-xs text-gray-500">사용중</span></div>
          </div>
        </div>
      </div>

      {showPopup && (
        <FullRoomPopup
          onClose={() => setShowPopup(false)}
          onNavigate={() => onNavigate('frontierHall' as any)} // 204호로 이동 시
          occupancyRate={currentOccupancyRate} // 현재 보고 있는 장소의 혼잡도
        currentLocationName={locationName}
          frontierRate={isFrontier204 ? currentOccupancyRate : 0.33} // 💡 204호 데이터 전달
        />
      )}
    </div>
  );
}