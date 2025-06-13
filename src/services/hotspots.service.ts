import originalData from "../assets/original_dataset.json";

// Cache the processed data for efficiency
let processedHotspots: any[] | null = null;

// Helper function to process hotspots data from JSON format to match previous API structure
const processHotspotsData = () => {
  if (processedHotspots) return processedHotspots;

  const hotspotEntries = Object.entries(originalData.hotspots);

  processedHotspots = hotspotEntries.map(([_, hotspotData]) => {
    // Find all panoramas for this hotspot
    const hotspotPanoramas = Object.values(originalData.panoramas).filter(
      (panorama) => panorama.hotspot_id === hotspotData.id
    );

    return {
      ...hotspotData,
      panoramas: hotspotPanoramas,
    };
  });

  return processedHotspots;
};

export const getAllHotspots = async () => {
  // Simulate async behavior for API compatibility
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(processHotspotsData());
    }, 300); // Small delay to simulate network request
  });
};

// Search hotspots by title
export const searchHotspotsByTitle = async (title: string) => {
  // Get all hotspots and filter by title
  const hotspots = processHotspotsData();
  const filteredHotspots = hotspots.filter((hotspot) =>
    hotspot.title.toLowerCase().includes(title.toLowerCase())
  );

  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filteredHotspots);
    }, 200);
  });
};

export const getHotspotById = async (id: string) => {
  const hotspots = processHotspotsData();
  const hotspot = hotspots.find((h) => h.id.toString() === id.toString());

  if (!hotspot) {
    throw new Error("Hotspot not found");
  }

  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(hotspot);
    }, 100);
  });
};

export const createHotspot = async (hotspotData: any) => {
  // Generate a new ID (in a real app this would be done by the database)
  const allHotspots = processHotspotsData();
  const newId = Math.max(...allHotspots.map((h) => h.id)) + 1;

  const newHotspot = {
    id: newId,
    title: hotspotData.title,
    description: hotspotData.description,
    image_url: hotspotData.imageUrl,
    preview_image_url: hotspotData.imageUrl,
    latitude: hotspotData.latitude || null,
    longitude: hotspotData.longitude || null,
    panoramas: [],
  };

  // In a real app, this would be persisted to the database
  // For our case, add it to the cached array so it appears in subsequent queries
  processedHotspots?.push(newHotspot);

  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newHotspot);
    }, 300);
  });
};

// Get all panoramas for a specific hotspot ID

// Get all panoramas for a specific hotspot ID
export const getPanoramasByHotspotId = async (hotspotId: number | string) => {
  // Convert hotspotId to number for comparison since the JSON data uses numbers
  const numericHotspotId =
    typeof hotspotId === "string" ? parseInt(hotspotId, 10) : hotspotId;
  // Filter panoramas that belong to the specified hotspot
  const hotspotPanoramas = Object.values(originalData.panoramas).filter(
    (panorama) => panorama.hotspot_id === numericHotspotId
  );

  // If no panoramas found, you might want to handle this case
  if (hotspotPanoramas.length === 0) {
    console.warn(`No panoramas found for hotspot ID: ${hotspotId}`);
  }

  // Simulate async behavior for API compatibility
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(hotspotPanoramas);
    }, 200);
  });
};
