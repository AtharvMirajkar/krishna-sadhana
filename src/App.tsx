import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { MantraLibrary } from './components/MantraLibrary';
import { ChantingTracker } from './components/ChantingTracker';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'mantras':
        return <MantraLibrary />;
      case 'tracker':
        return <ChantingTracker />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
