import { mockApi } from "./mockApi";

// Later when the backend is available: replace mockApi with httpApi (implementation only)
export const api = {
  completeProfile: mockApi.completeProfile,
  confirmLocation: mockApi.confirmLocation,
};
