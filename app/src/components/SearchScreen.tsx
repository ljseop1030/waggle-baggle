import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Screen } from '../App';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface SearchScreenProps {
  onLocationClick: (screen: Screen) => void;
}

export function SearchScreen({ onLocationClick }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeSeats, setRealtimeSeats] = useState<any>(null);

  // 1. Firebase 실시간 연결 (PDF Phase 2 기준)
  useEffect(() => {
    // 팀원 A가 'seats'라는 경로 아래에 seat_1, seat_2, seat_3를 저장하므로 
    // root나 'seats' 경로를 참조합니다.
    const seatsRef = ref(database, 'seats');
    const unsubscribe = onValue(seatsRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) setRealtimeSeats(data);
    });
    return () => unsubscribe();
  }, []);

  const getDynamicLocations = () => {
    // --- 204호 계산 로직 (팀원 A 데이터 기반) ---
    const getFrontierData = () => {
      // 데이터가 아직 안 들어왔을 때의 초기값
      if (!realtimeSeats) {
        return { rate: 0, available: 3, total: 3 }; 
      }

      // 팀원 A가 사용하는 키값: seat_1, seat_2, seat_3
      const targetKeys = ['seat_1', 'seat_2', 'seat_3'];
      const total = 3;
      
      // occupied: true인 개수만 필터링해서 세기
      const occupied = targetKeys.filter(key => 
        realtimeSeats[key] && realtimeSeats[key].occupied === true
      ).length;
      
      return {
        rate: occupied / total,
        available: total - occupied,
        total: total
      };
    };

    // --- 와글와글실 계산 로직 (요청대로 혼잡 고정) ---
    const wagleTotal = 48;
    const wagleOccupied = 40; // 83% 고정
    const wagleRate = wagleOccupied / wagleTotal;
    const wagleAvailable = wagleTotal - wagleOccupied;

    const frontier = getFrontierData();

    // 혼잡도 상태/색상 결정 함수
    const getStatusInfo = (r: number) => {
      if (r < 0.4) return { text: '여유', color: 'green' as const };
      if (r < 0.8) return { text: '보통', color: 'yellow' as const };
      return { text: '혼잡', color: 'red' as const };
    };

    const wagleInfo = getStatusInfo(wagleRate);
    const frontierInfo = getStatusInfo(frontier.rate);

    return [
      {
        id: 'wagleLounge' as Screen,
        name: '별관도서관 와글와글실',
        building: '별관도서관',
        occupancyRate: wagleRate,
        status: wagleInfo.text,
        statusColor: wagleInfo.color,
        availableSeats: wagleAvailable,
        totalSeats: wagleTotal,
      },
      {
        id: 'frontierHall' as Screen,
        name: '프론티어관 204호',
        building: '프론티어관',
        occupancyRate: frontier.rate,
        status: frontierInfo.text,
        statusColor: frontierInfo.color,
        availableSeats: frontier.available,
        totalSeats: frontier.total,
      }
    ];
  };

  const currentLocations = getDynamicLocations();

  // 검색 필터링 로직
  const filteredLocations = currentLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 테일윈드 색상 클래스 매핑
  const getStatusColorClass = (color: 'green' | 'yellow' | 'red') => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-[#B90005]';
    }
  };

  const getStatusTextColorClass = (color: 'green' | 'yellow' | 'red') => {
    switch (color) {
      case 'green': return 'text-green-700';
      case 'yellow': return 'text-yellow-700';
      case 'red': return 'text-[#B90005]';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-gray-50">
      <div className="bg-white shadow-sm p-6 pb-4">
        <h1 className="text-2xl font-bold text-[#0A1F62] mb-4">장소 검색</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8F8F]" />
          <input
            type="text"
            placeholder="장소나 건물명을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-[#0A1F62] focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => onLocationClick(location.id)}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{location.name}</h3>
                  <p className="text-sm text-[#8F8F8F]">{location.building}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColorClass(location.statusColor)} animate-pulse`}></div>
                  <span className={`font-semibold text-sm ${getStatusTextColorClass(location.statusColor)}`}>
                    {location.status}
                  </span>
                </div>
              </div>

              {/* 가로형 혼잡도 바 그래프 */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>사용 현황</span>
                  <span className="font-semibold">{Math.floor(location.occupancyRate * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStatusColorClass(location.statusColor)} transition-all duration-700 ease-in-out`}
                    style={{ width: `${location.occupancyRate * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 빈 좌석 정보 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">빈 좌석:</span>
                  <span className="font-bold text-[#0A1F62]">{location.availableSeats}석</span>
                </div>
                <span className="text-[#8F8F8F]">전체 {location.totalSeats}석</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}