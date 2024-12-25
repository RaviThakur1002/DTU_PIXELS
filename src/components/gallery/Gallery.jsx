import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import Pagination from "../Utilities/Pagination.jsx";
import LoadingSpinner from "../Utilities/LoadingSpinner.jsx";
import { useGallery } from "../contexts/GalleryContext.jsx";
import "./Gallery.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginModal from "../Utilities/LoginModal.jsx";

const Images = lazy(() => import("./Images"));

const Gallery = ({ userName = null, isProfile = false }) => {
  const {
    allGalleryData,
    userGalleryData,
    setUserGalleryData,
    lastFetchTime,
    isDataLoaded,
    fetchImages,
  } = useGallery();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [gridColumns, setGridColumns] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const funnyQuotes = useMemo(
    () => [
      "Loading images faster than a cat can knock a glass off a table...",
      "Hang tight! We're developing these photos in our digital darkroom...",
      "Fetching images... and maybe a stick if we have time.",
      "Loading gallery... Please enjoy this virtual moment of zen.",
      "Curating your visual feast... It's like herding pixels!",
    ],
    [],
  );

  const randomQuote = useMemo(
    () => funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)],
    [funnyQuotes],
  );

  const getGridColumns = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return 4;
    if (width >= 768) return 3;
    if (width >= 500) return 2;
    return 1;
  }, []);

  const updateGridAndPosts = useCallback(() => {
    const columns = getGridColumns();
    setGridColumns(columns);
    setPostPerPage(columns === 1 ? 5 : columns * 4);
  }, [getGridColumns]);

  useEffect(() => {
    updateGridAndPosts();
    window.addEventListener("resize", updateGridAndPosts);
    return () => window.removeEventListener("resize", updateGridAndPosts);
  }, [updateGridAndPosts]);

  useEffect(() => {
    const checkAndFetchImages = async () => {
      if (!isDataLoaded) return;

      const currentTime = new Date().getTime();
      const fetchTimeThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (
        !lastFetchTime ||
        currentTime - new Date(lastFetchTime).getTime() > fetchTimeThreshold
      ) {
        setIsLoading(true);
        await fetchImages();
        setIsLoading(false);
      }
    };

    checkAndFetchImages();
  }, [isDataLoaded, lastFetchTime, fetchImages]);

  useEffect(() => {
    if (allGalleryData && userName) {
      const filteredData = allGalleryData.filter(
        (image) => image.userName === userName,
      );
      setUserGalleryData(filteredData);
    } else if (allGalleryData) {
      setUserGalleryData(null);
    }
  }, [allGalleryData, userName, setUserGalleryData]);

  const galleryData = userName ? userGalleryData : allGalleryData;

  const { currentPosts, totalPosts } = useMemo(() => {
    if (!galleryData) return { currentPosts: [], totalPosts: 0 };
    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    return {
      currentPosts: galleryData.slice(firstPostIndex, lastPostIndex),
      totalPosts: galleryData.length,
    };
  }, [galleryData, currentPage, postPerPage]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner quote={randomQuote} />;
  }

  if (!isDataLoaded) {
    return <LoadingSpinner quote="Initializing gallery..." />;
  }

  if (!galleryData || galleryData.length === 0) {
    return (
      <p className="text-center text-gray-400 text-xl">
        No images to display. Check back after contests have ended.
      </p>
    );
  }

  return (
    <div className="bg-black">
      {/* {!isLoggedIn && (<LoginModal/>)} */}
      <div className="bg-gradient-to-b from-[#000000] to-[#171717] rounded-lg py-10">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text">
            {isProfile ? "My Submissions" : "Gallery"}
          </h1>
        </div>
      </div>

      <div className="w-full mx-auto px-12 min-h-screen gallery-container bg-[#000000] flex justify-center items-start pt-10">
        <div className="w-full max-w-6xl m-1">
          <Suspense fallback={<LoadingSpinner quote={randomQuote} />}>
            <Images
              imageData={currentPosts}
              isProfile={isProfile}
              gridColumns={gridColumns}
            />
          </Suspense>
          <Pagination
            totalPosts={totalPosts}
            postsPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
