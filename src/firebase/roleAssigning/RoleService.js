import { getDatabase, ref, set, get } from "firebase/database";
import app from "../../config/conf";
import { getAuth } from "firebase/auth";

class RoleService{
  constructor(){
    this.database = getDatabase(app);
    this.auth = getAuth();
    this.roleRef = ref(this.database, 'userRoles');
  }

  async setRole(userId, role){
    try{
      if(!userId || !role){
        throw new Error('User ID and role are required.');
      }
      
      await set(ref(this.database, 'userRoles/' + userId), role);
      alert(`Role ${role} set for user ${userId}`);
    }
    catch(error){
      console.error('Error setting role:', error.message);
    }
  }

  async getRole(){
    try{
      const user = this.auth.currentUser;
      if(user){
        const snapshot = await get(ref(this.database, 'userRoles/' + user.uid));
        return snapshot.exists() ? snapshot.val() : 'user';
      }
      else return 'guest';
    }
    catch(error){
      console.error('Error getting role:', error.message);
      return 'guest';
    }
  }
}

const roleService = new RoleService();
export default roleService;
