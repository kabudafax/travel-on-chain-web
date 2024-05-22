import { create } from 'zustand';

interface ModalState {
	isShow: boolean;
	setIsShow: (isShow: boolean) => void;
	renderCallback: (() => void) | null;
	setRenderCallback: (callback: () => void) => void;
}

export const useModalStore = create<ModalState>((set) => ({
	isShow: false,
	setIsShow: (isShow) => set({ isShow: isShow }),
	renderCallback: null,
	setRenderCallback: (callback: () => void) => set({ renderCallback: callback }),
}));
