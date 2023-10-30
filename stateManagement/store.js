import {create} from "zustand";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const useStore = create((set) => ({
    token: cookies.get("jwt"),
    decodedToken: null,
    setTokenToStorage: (token) => set(() => cookies.set("jwt", token)),
    extractJwtFromStorage: () => set({token: cookies.get("jwt")}),
    decodeToken: () => set((state) => ({decodedToken: jwtDecode(state.token)}))
}))

export default useStore;
