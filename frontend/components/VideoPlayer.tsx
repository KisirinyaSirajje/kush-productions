"use client";

interface VideoPlayerProps {
  src: string;
  movieId: string;
  title: string;
  onProgress?: (progress: number) => void;
  initialProgress?: number;
}

// Function to extract YouTube video ID and convert to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  }
  
  return null;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  // Don't render if no valid source
  if (!src || src.trim() === '') {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-2">No video available</p>
          <p className="text-sm text-gray-400">This movie doesn't have a video source yet</p>
        </div>
      </div>
    );
  }

  // Check if it's a YouTube URL
  const youtubeEmbedUrl = getYouTubeEmbedUrl(src);
  
  if (youtubeEmbedUrl) {
    // Render YouTube iframe
    return (
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={youtubeEmbedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // If not a YouTube URL, show message
  return (
    <div className="w-full aspect-video bg-black flex items-center justify-center text-white">
      <div className="text-center p-8">
        <p className="text-xl mb-2">Invalid video URL</p>
        <p className="text-sm text-gray-400 mb-4">Please provide a valid YouTube video URL</p>
        <p className="text-xs text-gray-500">Supported formats:</p>
        <p className="text-xs text-gray-500 mt-1">https://www.youtube.com/watch?v=...</p>
        <p className="text-xs text-gray-500">https://youtu.be/...</p>
      </div>
    </div>
  );
}
