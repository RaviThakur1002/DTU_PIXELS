import { getAuth } from "firebase/auth";
import React, { useState } from "react"

const CopyUID = () => {

  const [copySuccess, setCopySuccess] = useState(false);
  // const [userId, setUserId] = useState("");

  const copytoClip = async () => {
    try{
      const auth = getAuth();
      const user = auth.currentUser;
      await navigator.clipboard.writeText(user.uid);
      setCopySuccess(true);
      setTimeout(()=> setCopySuccess(false), 2000);
    }
    catch(err){
      console.error('Failed to copy text: ', err);  
    }
  }

  return(
    <div className="flex justify-center">
      <button className='w-full mx-2 px-3 py-2 text-sm font-medium text-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'
      onClick={copytoClip}>
        {copySuccess ? 'Copied!' : 'Copy User ID'}
      </button>
    </div>
  )
}

export default CopyUID;
