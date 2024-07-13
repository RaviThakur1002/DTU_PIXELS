import React from "react";
import UploadComponent from "../contests/functions/UploadComponent.jsx";
import ImageSlider from "./ImageSlider/ImageSlider.jsx";
import Contact from "../Footer/Contact.jsx";
import Hero from "./Hero.jsx";
import Footer from "../Footer/Footer.jsx";
import DTUPixelLogo from "../../components/logo/logo.jsx";
import Separator from "../Separator.jsx";

const Home = () => {
  return (
    <>
      <DTUPixelLogo />
      <Hero />

 

      <ImageSlider />

      <Contact />
     
      <Footer />
    </>
  );
};

export default Home;
