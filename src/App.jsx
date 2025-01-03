import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Gallery from "./components/gallery/Gallery.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Temp from "./components/contests/temp/Temp.jsx";
import Footer from "./components/Footer/Footer.jsx";
import PerContestPage from "./components/contests/perContestPage/PerContestPage.jsx";
import { GalleryProvider } from "./components/contexts/GalleryContext.jsx";
import { ContestProvider } from "./components/contexts/ContestContext.jsx";
import HallOfFame from './components/HallOfFame/HallOfFame.jsx'
import HomeScreen from './components/HomeScreen/HomeScreen.jsx'

const App = () => {
  return (
    <Router>
      <GalleryProvider>
        <ContestProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeScreen /> } />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<HomeScreen /> } />
            <Route path="/contest" element={<Temp />} />
            <Route path="/submissions" element={<Profile />} />
            <Route path="/contest/:contestId" element={<PerContestPage />} />
            <Route path="/winners" element={<HallOfFame />} />
          </Routes>
          <Footer />
        </ContestProvider>
      </GalleryProvider>
    </Router>
  );
};

export default App;
