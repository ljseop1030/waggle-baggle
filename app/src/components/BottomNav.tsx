import { Map, Search, User } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const isActive = (screen: Screen) => currentScreen === screen;

  const navItems = [
    { screen: 'map' as Screen, icon: Map, label: '지도' },
    { screen: 'search' as Screen, icon: Search, label: '검색' },
    { screen: 'profile' as Screen, icon: User, label: '프로필' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-4 rounded-t-3xl shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map(({ screen, icon: Icon, label }) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
              isActive(screen)
                ? 'bg-[#0A1F62] text-white scale-110'
                : 'text-[#8F8F8F] hover:text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}