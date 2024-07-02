import React, { useState, useEffect } from "react";
import authService from "./firebase/auth/auth.js";
import Gallery from "./components/gallery/Gallery.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

function App() {
    const [imageUrl, setImageUrl] = useState("");

    return (
        <>
            <Navbar />
            <Gallery />
        </>
    );
}

export default App
