import { create } from "zustand"

const useNavbarStore = create((set) => ({
  isOpen: false,
  toggleNavbar: () => set((state: { isOpen: boolean }) => ({ isOpen: !state.isOpen })),
}))

export default useNavbarStore
