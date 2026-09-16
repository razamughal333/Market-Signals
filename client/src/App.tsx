import { Routes, Route } from 'react-router-dom';
import TradingBackground from './components/TradingBackground';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AssetList from './pages/AssetList';
import AssetDetail from './pages/AssetDetail';
import Search from './pages/Search';
import Explore from './pages/Explore';
import About from './pages/About';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <TradingBackground />
      <NavBar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AssetList />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
