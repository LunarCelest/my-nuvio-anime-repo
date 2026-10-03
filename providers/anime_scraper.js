// providers/anime_scraper.js

function getStreams(tmdbId, mediaType, season, episode) {
  // 1. First, lookup the anime title or query the website search endpoint
  // Standard TMDB to Anime search resolution example
  const searchUrl = "https://anikototv.to/api/v1/search?tmdbId=" + encodeURIComponent(tmdbId);

  return fetch(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json"
    }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      // 2. Parse search results or scrape direct embed/HLS video stream (.m3u8)
      // Map extracted data into Nuvio's required Stream Format
      const streamUrl = data.streamUrl || data.file || "";
      
      if (!streamUrl) {
        return [];
      }

      return [
        {
          name: "Anikoto (1080p)",
          title: "Subbed • HLS Direct Stream",
          url: streamUrl, // Direct .m3u8 or .mp4 link
          quality: "1080p",
          headers: {
            "Referer": "https://anikototv.to/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
          }
        }
      ];
    })
    .catch(function (error) {
      // Return an empty array if scraping fails or returns no streams
      return [];
    });
}

// Export the getStreams function so Nuvio can execute it
module.exports = { getStreams };