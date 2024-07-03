

export const galleryImgLoader = async()=> {
  
  try {

    const response = await fetch("https://api.unsplash.com/photos/random?count=30", {
      headers: {
        Authorization: "Client-ID r44OcdTVIj6wgDTdHRXB3nW-kfWDYxT6Y1f__CYhzME",
      },
    })
    return response.json();   

  } catch (error) {

    console.error("Error fetching image data:", error);
    
  }

}
