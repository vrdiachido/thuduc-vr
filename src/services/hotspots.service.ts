import supabase from "../library/supabase.client";

export const getAllHotspots = async () => {
  const { data, error } = await supabase.from("hotspots").select(`
      *, 
      panoramas:panorama!hotspot_id(id, title, preview_image_url)
    `);
  if (error) {
    throw error;
  }
  return data;
};

// Search hotspots by title
export const searchHotspotsByTitle = async (title: string) => {
  const { data, error } = await supabase
    .from("hotspots")
    .select(
      `
      *,
      panoramas:panorama!hotspot_id(id, title, preview_image_url)
    `
    )
    .ilike("title", `%${title}%`);
  console.log("searchHotspotsByTitle", data);
  if (error) {
    throw error;
  }
  return data;
};

export const getHotspotById = async (id: string) => {
  const { data, error } = await supabase
    .from("hotspots")
    .select(
      `
      *,
      panoramas:panorama!hotspot_id(id, title, preview_image_url)
    `
    )
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const createHotspot = async (hotspotData) => {
  const { data, error } = await supabase
    .from("hotspots")
    .insert([
      {
        title: hotspotData.title,
        description: hotspotData.description,
        image_url: hotspotData.imageUrl,
        latitude: hotspotData.latitude || null,
        longitude: hotspotData.longitude || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
