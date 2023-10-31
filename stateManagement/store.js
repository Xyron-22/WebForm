import {create} from "zustand";
import Cookies from "js-cookie";

const useStore = create((set) => ({
    token: Cookies.get("jwt"),
    setTokenToStorage: (token) => set(() => Cookies.set("jwt", token)),
    extractJwtFromStorage: () => set({token: Cookies.get("jwt")}),
    setTokenToNull: () => set({token: null}),
}))

export default useStore;
