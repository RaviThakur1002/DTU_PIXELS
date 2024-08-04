import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./components/Home/Home.jsx";
import Gallery from "./components/gallery/Gallery.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Temp from "./components/contests/temp/Temp.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CreateContest from "./components/Admin/CreateContest.jsx";
import ContestVoting from "./components/contests/voting/ContestVoting.jsx";
import PerContestPage from "./components/contests/perContestPage/PerContestPage.jsx";
import { GalleryProvider } from "./components/contexts/GalleryContext.jsx";

const App = () => {
  return (
    <Router>
      <GalleryProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<Home />} />
          <Route path="/contest" element={<Temp />} />
          <Route path="/submissions" element={<Profile />} />
          <Route path="/contest/createcontest" element={<CreateContest />} />
          <Route path="/contest/voting" element={<ContestVoting />} />
          <Route path="/contest/:contestId" element={<PerContestPage />} />
        </Routes>
        <Footer />
      </GalleryProvider>
    </Router>
  );
};

export default App;
