import dragonImage from '../assets/dragon.png';

interface FullRoomPopupProps {
  onClose: () => void;
  onNavigate: () => void;
  occupancyRate: number; // 현재 있는 장소의 혼잡도
  currentLocationName: string;
  frontierRate: number;   // 💡 추가: 실시간 204호 혼잡도를 부모로부터 받음
}

export function FullRoomPopup({ 
  onClose, 
  onNavigate, 
  occupancyRate, 
  currentLocationName,
  frontierRate // 실시간 데이터
}: FullRoomPopupProps) {

  // 1. 실시간 데이터를 반영한 장소 리스트
  const locations = [
    { name: '별관도서관 와글와글실', rate: 0.83 }, // 고정값
    { name: '프론티어관 204호', rate: frontierRate }, // 💡 실시간 연동
  ];
  
  // 2. 추천 장소 찾기 (현재 장소가 아니면서 혼잡도 80% 미만인 곳)
  const recommendedLocation = locations.find(
    loc => loc.name !== currentLocationName && loc.rate < 0.8
  );
  
  const recommendedName = recommendedLocation?.name || '다른 여유 장소';

  // 💡 3. 이동하기 클릭 시 실행될 함수
  const handleNavigate = () => {
    onNavigate(); // 화면 이동 실행
    onClose();    // 팝업 닫기 실행 (이게 없어서 안 닫혔던 거예요!)
  };
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0A1F62]/10 rounded-full p-6">
            <img 
              src={dragonImage} 
              alt="Dragon Character" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            너무 혼잡해용! 😢
          </h3>
          <p className="text-gray-600 mb-1">
            {currentLocationName}의 혼잡도: <span className="font-bold text-[#B90005]">{Math.floor(occupancyRate * 100)}%</span>
          </p>
          
          {recommendedLocation ? (
            <p className="text-gray-600">
              <span className="font-semibold text-[#0A1F62]">{recommendedName}</span>로 이동하시는 건 어때용?
            </p>
          ) : (
            <p className="text-gray-600">현재 모든 장소가 혼잡해용!</p>
          )}
        </div>

        <div className="space-y-3">
          {recommendedLocation && (
            <button
              onClick={handleNavigate} // 💡 수정된 핸들러 연결
              className="w-full bg-[#0A1F62] text-white font-semibold py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all active:scale-95"
            >
              {recommendedName}로 가기 ✨
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-200 transition-colors active:scale-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}