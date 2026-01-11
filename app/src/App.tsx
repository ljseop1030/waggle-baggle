import { useState } from 'react';
import { MapScreen } from './components/MapScreen';
import { SeatLayoutScreen } from './components/SeatLayoutScreen';
import { SearchScreen } from './components/SearchScreen';
import { BottomNav } from './components/BottomNav';
import { ProfileScreen } from './components/ProfileScreen';

export type Screen = 'map' | 'search' | 'profile' | 'wagleLounge' | 'frontierHall';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'map':
        return <MapScreen onLocationClick={setCurrentScreen} />;
      case 'wagleLounge':
        return (
          <SeatLayoutScreen
            locationName="별관도서관 와글와글실"
            status="여유"
            statusColor="green"
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
        return (
          <SearchScreen onLocationClick={setCurrentScreen} />
        );
      case 'profile':
        return (
          <ProfileScreen />
        );
      default:
        return <MapScreen onLocationClick={setCurrentScreen} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-b from-slate-50 to-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}