// src/components/VideoGallery.tsx
import React from 'react';
import { Video } from '../types';

interface Props {
  videos: Video[];
}

// Renders a list of video highlights
const VideoGallery: React.FC<Props> = ({ videos }) => {
  return (
    <section>
      <h3>Highlight Videos</h3>
      {videos.length === 0 ? (
        <p>No highlight videos available.</p>
      ) : (
        videos.map((video, index) => (
          <div key={index}>
            {video.title && <p>{video.title}</p>}
            <video width="480" controls style={{ marginBottom: '1rem' }}>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      )}
    </section>
  );
};

export default VideoGallery;
