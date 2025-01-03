import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import photographerImage from "./camera.png";
import Contact from "../Footer/Contact";
import Info from "./Info";
import Gallery from "./Gallery";
import DailyQuiz, { QuizButton } from "../Quiz/DailyQuiz.jsx";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../config/conf.js";
import LoginModal from "../Utilities/LoginModal.jsx";

const CanvasEffect = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    contextRef.current = context;

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeHandler);

    // Create particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
      });
    }

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
    />
  );
};

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 useEffect(() => {
    setIsVisible(true);
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (user) {
        fetchUserData(user);
        setShowLoginModal(false); // Close the login modal when user logs in
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    const db = getDatabase(app);
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      setStreak(userData.streak || 0);
      setLongestStreak(userData.longestStreak || 0);
    }
  };

  const handleQuizButtonClick = () => {
    if (isLoggedIn) {
      setShowQuiz(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };


  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={stagger}
      className="bg-[#000000] relative"
    >
      <CanvasEffect />
      <motion.div className="text-white p-8 relative z-10" variants={fadeInUp}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div className="md:w-1/2 mb-8 md:mb-0" variants={fadeInUp}>
              <motion.p
                className="text-[#cba6f7] text-2xl font-semibold mb-2"
                variants={fadeInUp}
              >
                UNLEASH YOUR CREATIVITY
              </motion.p>
              <motion.h1
                className="text-4xl md:text-5xl font-bold leading-tight mb-8 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text"
                style={{ lineHeight: "1.2", paddingBottom: "0.2em" }}
                variants={fadeInUp}
              >
                Discover the Ultimate Photography Experience.
              </motion.h1>
              <motion.p
                className="text-gray-300 mb-6 text-xl"
                variants={fadeInUp}
              >
                Join a thriving community, unleash your creativity, connect with
                like-minded visionaries, and elevate your craft to new heights.
              </motion.p>
              <QuizButton
                onClick={handleQuizButtonClick}
                className="px-6 py-3 bg-gradient-to-r from-[#6528d7] to-[#b00bef] text-white font-semibold rounded-full hover:from-[#b00bef] hover:to-[#6528d7] transition transform hover:scale-105"
              />
            </motion.div>
            <motion.div className="md:w-1/2" variants={fadeInUp}>
              <motion.img
                src={photographerImage}
                alt="Photographer"
                className="w-full h-auto rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
          </div>
          <motion.div
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={fadeInUp}
          >
            {["Contests", "Community", "Learning", "Exhibition"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center justify-center bg-[#171717] px-4 py-2 rounded-full border-2 text-center"
                  style={{
                    borderColor: index % 2 === 0 ? "#6528d7" : "#b00bef",
                  }}
                  variants={fadeInUp}
                  custom={index}
                >
                  <span
                    className={`text-${index % 2 === 0 ? "[#6528d7]" : "[#b00bef]"} text-2xl mr-2`}
                  >
                    ●
                  </span>
                  <span className="text-white text-sm sm:text-base">
                    {item}
                  </span>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Info component */}
      <div className="relative z-10">
        <Info />
      </div>

      {/* Gallery component */}
      <div className="relative z-10">
        <Gallery />
      </div>

      {/* DailyQuiz component */}
      {showQuiz && (
        <div className="relative z-20">
          <DailyQuiz onClose={() => setShowQuiz(false)} />
        </div>
      )}

       {showLoginModal && (
        <LoginModal onClose={closeLoginModal} />
      )}

      {/* Contact component */}
      <div className="relative z-10">
        <Contact />
      </div>
    </motion.div>
  );
};

export default HomeScreen;

