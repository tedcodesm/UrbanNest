export const optimizeImage = (url, width = 600) => {
  if (typeof url !== "string" || !url || url.trim() === "" || url === "undefined" || url === "null") {
    // Fallback if URL is missing or clearly invalid data
    return `https://via.placeholder.com/${width}x${Math.round(width * 0.75)}.png?text=Image+Unavailable`;
  }
  
  let imageUrl = url.trim();
  
  // Handle protocol-relative URLs (e.g., //res.cloudinary.com)
  if (imageUrl.startsWith("//")) {
    imageUrl = "https:" + imageUrl;
  }
  
  // Apply Cloudinary optimization if applicable
  if (imageUrl.includes("cloudinary.com") && imageUrl.includes("/upload/")) {
    // Only add transformations if not already present
    // Check for common Cloudinary transformation markers
    if (!imageUrl.includes("/w_") && !imageUrl.includes("/c_") && !imageUrl.includes("/q_")) {
      // Find the position after '/upload/' to insert transformations
      const uploadIndex = imageUrl.indexOf("/upload/") + 8;
      const part1 = imageUrl.slice(0, uploadIndex);
      const part2 = imageUrl.slice(uploadIndex);
      
      // We use g_auto with c_fill to ensure the most important part of the house is shown
      return `${part1}c_fill,g_auto,w_${width},q_auto/${part2}`;
    }
  }
  
  return imageUrl;
};
