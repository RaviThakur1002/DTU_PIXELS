import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, remove, runTransaction } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
`;

function RemoveContest({ contestId }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const setMessageWithTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const auth = getAuth();
      const db = getDatabase();
      const user = auth.currentUser;

      if (user) {
        try {
          const adminRef = ref(db, `userRoles/${user.uid}`);
          const adminSnapshot = await get(adminRef);
          setIsAdmin(adminSnapshot.exists());
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };

    checkAdmin();
  }, []);

  const handleClick = async () => {
    const db = getDatabase();
    try {
      await remove(ref(db, `contests/${contestId}`));

      const highestIdRef = ref(db, `highestContestId`);
      await runTransaction(highestIdRef, (current)=>{
        if(current===contestId){
          return current-1;
        }
        return current;
      })

      setMessageWithTimer("Contest removed successfully", "success");
      navigate("/contest");
    } catch (error) {
      setMessageWithTimer("Error removing contest", "error");
      console.error("Error removing contest:", error);
    }
  };

  if (!isAdmin) return null;

  return (
    <div>
      <style>{styles}</style>

      {message && (
        <div
          className={`fixed top-4 right-0 mb-4 p-3 rounded-l-lg w-64 ${
            messageType === "success"
              ? "bg-gradient-to-r from-green-600 to-green-800 text-white"
              : messageType === "error"
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
          } border border-solid ${
            messageType === "success"
              ? "border-green-500"
              : messageType === "error"
                ? "border-red-500"
                : "border-blue-400"
          } text-center transition-all duration-300 ease-in-out transform translate-x-0 shadow-md z-50`}
          style={{
            animation: `${message ? "slideIn" : "slideOut"} 0.3s ease-in-out forwards`,
          }}
        >
          <p className="font-semibold">{message}</p>
        </div>
      )}

      <button 
  className="bg-gradient-to-r from-[#b00bef] to-[#6528d7] hover:from-[#c638ab] hover:to-[#5a23c0] text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
  onClick={() => handleClick()}
>
  Remove Contest
</button>
    </div>
  );
}

export default RemoveContest;
