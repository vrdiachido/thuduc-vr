import { create } from "zustand";
import {
  getAllHotspots,
  searchHotspotsByTitle,
} from "../services/hotspots.service";

const useHotspotStore = create((set, get) => ({
  allHotspots: [], // This will store the original list
  hotspots: [], // This will store the filtered list
  loading: false,
  error: null,
  // Initialize/fetch all hotspots
  fetchHotspots: async () => {
    // Don't refetch if already loading
    if (get().loading) return;

    try {
      set({ loading: true, error: null });
      const data = await getAllHotspots();
      set({
        allHotspots: data,
        hotspots: data,
        loading: false,
      });
      return data; // Return data to allow component to know when fetch is complete
    } catch (error) {
      set({
        error: error?.message || "Error fetching hotspots",
        loading: false,
      });
      return []; // Return empty array in case of error
    }
  },

  setHotspots: (hotspots) => set({ allHotspots: hotspots, hotspots }),
  searchTitle: "",
  setSearchTitle: (searchTitle) => set({ searchTitle }),
  // Search hotspots using the API service
  searchHotspots: async (searchTitle) => {
    // Don't search if already loading
    if (get().loading) return;

    try {
      set({ loading: true, error: null });
      if (!searchTitle.trim()) {
        // If search is empty, load all hotspots
        const data = await getAllHotspots();
        set({
          hotspots: data,
          loading: false,
        });
      } else {
        // Search by title using the service
        const data = await searchHotspotsByTitle(searchTitle);
        set({
          hotspots: data,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error?.message || "Error searching hotspots",
        loading: false,
      });
    }
  },
  clearSearch: async () => {
    // Don't clear if already loading
    if (get().loading) return;

    set({ searchTitle: "" });
    try {
      set({ loading: true, error: null });
      const data = await getAllHotspots();
      set({
        hotspots: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error?.message || "Error clearing search",
        loading: false,
      });
    }
  },
  setCurrentHotspot: (currentHotspot) => set({ currentHotspot }),
  currentHotspot: null,
  setCurrentHotspotById: (id) => {
    set((state) => ({
      currentHotspot: state.hotspots.find((hotspot) => hotspot.id === id),
    }));
  },
}));

export default useHotspotStore;
