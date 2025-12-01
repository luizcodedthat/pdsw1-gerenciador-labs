import { auth, googleProvider } from "@/firebase/firebase"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth"

class LoginService {

  async loginEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async loginGoogle() {
    return signInWithPopup(auth, googleProvider)
  }

  async logout() {
    return signOut(auth)
  }
}

export default new LoginService()
