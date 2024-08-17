import React from "react";
import authService from "../../firebase/auth/auth";

function LoginModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 backdrop-blur-lg z-30">
      <div className="text-center text-white">
        <p className="mb-4 text-xl">
          Don't miss out on anything. Login to unlock.
        </p>
        <button onClick={()=> authService.googleSignIn()} className="px-4 py-2 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-white font-semibold rounded-lg hover:from-[#c638ab] hover:via-[#b00bef] hover:to-[#6528d7] transition">
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
