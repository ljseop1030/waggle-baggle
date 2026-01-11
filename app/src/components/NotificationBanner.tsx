import dragonImage from '../assets/dragon.png';
import { X } from 'lucide-react';

interface NotificationBannerProps {
  locationName: string;
  occupancyRate: number;
  threshold: number;
  onClose: () => void;
}

export function NotificationBanner({
  locationName,
  occupancyRate,
  threshold,
  onClose,
}: NotificationBannerProps) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-[#0A1F62]/20 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          {/* Dragon Character */}
          <div className="flex-shrink-0 w-16 h-16 bg-[#0A1F62]/10 rounded-full p-2">
            <img 
              src={dragonImage} 
              alt="Dragon" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Message */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-1">좌석 추천 알림</h4>
            <p className="text-sm text-gray-700">
              <span className="font-bold text-[#0A1F62]">{locationName}</span>의 혼잡도가{' '}
              <span className="font-bold text-green-600">{occupancyRate}%</span> 예용!
            </p>
            <p className="text-xs text-gray-500 mt-1">
              지금 가면 여유롭게 사용할 수 있어용 ✨
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}