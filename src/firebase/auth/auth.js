import app from '../../config/conf.js'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export class AuthService{
  auth;
  provider;
  constructor() {
    this.auth = getAuth(app);
    this.provider = new GoogleAuthProvider();

    this.googleSignIn = this.googleSignIn.bind(this);
    this.signOutUser = this.signOutUser.bind(this);
  }

  async googleSignIn(){
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      console.log(result.user);
      return result.user;
    } catch (error) {
      console.error("Error in Google signIn:", error);
      throw error; 
    }
  }

  async signOutUser(){
    try {
      await signOut(this.auth);
      console.log("sign out successful!");
    } catch (error) {
      console.error("Error signed out:", error);
      throw error;
    }
  }

}

// export default AuthService

const authService = new AuthService();
export default authService

