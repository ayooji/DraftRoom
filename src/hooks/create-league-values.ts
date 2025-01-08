import { create } from 'zustand';

type CreateLeagueValues = {
  name: string;
  imageUrl: string;
  updateImageUrl: (url: string) => void;
  updateValues: (values: Partial<CreateLeagueValues>) => void;
  currStep: number;
  setCurrStep: (step: number) => void;
};

export const useCreateWorkspaceValues = create<CreateLeagueValues>((set) => ({
  name: '',
  imageUrl: '',
  updateImageUrl: (url) => set({ imageUrl: url }),
  updateValues: (values) => set(values),
  currStep: 1,
  setCurrStep: (step) => set({ currStep: step }),
}));