import React from 'react';
import { VideoGenerator as VideoGeneratorComponent } from '../../components/VideoGenerator';

export default function VideoGenerator() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-terminal-green">Video Generator</h1>
      <VideoGeneratorComponent />
    </div>
  );
}