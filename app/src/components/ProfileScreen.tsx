import { useState } from 'react';
import { Bell, BellOff, MapPin } from 'lucide-react';
import dragonImage from '../assets/dragon.png';
import { NotificationBanner } from './NotificationBanner';

export function ProfileScreen() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationThreshold, setNotificationThreshold] = useState(50);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  const favoriteLocation = {
    name: '프론티어관 204호',
    currentOccupancy: 33,
  };

  // 알림 조건 체크
  const checkNotification = () => {
    if (notificationEnabled && favoriteLocation.currentOccupancy <= notificationThreshold) {
      setShowNotificationBanner(true);
    }
  };

  const handleThresholdChange = (value: number) => {
    setNotificationThreshold(value);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-gray-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-6">
        <h1 className="text-2xl font-bold text-[#0A1F62]">프로필</h1>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="bg-white rounded-3xl p-6 shadow-md">
          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#0A1F62]/10 p-3 mb-4">
              <img 
                src={dragonImage} 
                alt="Profile" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">망나뇽</h2>
            <p className="text-sm text-gray-500 mt-1">와글바글 사용자</p>
          </div>

          {/* Favorite Location */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#0A1F62]" />
              <h3 className="font-bold text-gray-700">자주 사용하는 장소</h3>
            </div>
            <div className="bg-[#0A1F62]/5 rounded-2xl p-4">
              <p className="font-semibold text-gray-800">{favoriteLocation.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                현재 혼잡도: <span className="font-bold text-[#0A1F62]">{favoriteLocation.currentOccupancy}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-md mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {notificationEnabled ? (
                <Bell className="w-5 h-5 text-[#0A1F62]" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="font-bold text-gray-700">좌석 추천 알림</h3>
            </div>
            <button
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notificationEnabled ? 'bg-[#0A1F62]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>

          {notificationEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                알림 받을 혼잡도 기준: {notificationThreshold}% 이하
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={notificationThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0A1F62]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>

              {/* Test Notification Button */}
              <button
                onClick={checkNotification}
                className="w-full mt-4 bg-[#0A1F62] text-white font-semibold py-3 rounded-2xl hover:shadow-lg transition-all active:scale-95"
              >
                알림 테스트
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            💡 자주 사용하는 장소의 혼잡도가 설정한 수치 이하일 때 알림을 받을 수 있어용!
          </p>
        </div>
      </div>

      {/* Notification Banner */}
      {showNotificationBanner && (
        <NotificationBanner
          locationName={favoriteLocation.name}
          occupancyRate={favoriteLocation.currentOccupancy}
          threshold={notificationThreshold}
          onClose={() => setShowNotificationBanner(false)}
        />
      )}
    </div>
  );
}
