import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { generateImage } from '../openai';
import { VideoGenerationSettings } from '../../types/video';

export interface VideoProgress {
  phase: 'generating' | 'processing' | 'complete';
  progress: number;
  currentStep: string;
}

export class VideoGenerator {
  private ffmpeg: FFmpeg | null = null;
  private onProgress?: (progress: VideoProgress) => void;

  constructor(progressCallback?: (progress: VideoProgress) => void) {
    this.onProgress = progressCallback;
  }

  async init() {
    if (this.ffmpeg) return;

    try {
      this.ffmpeg = new FFmpeg();

      // Load FFmpeg with direct paths to files
      await this.ffmpeg.load({
        coreURL: '/ffmpeg/ffmpeg-core.js',
        wasmURL: '/ffmpeg/ffmpeg-core.wasm',
        workerURL: '/ffmpeg/ffmpeg-worker.js'
      });

      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      throw new Error('Failed to initialize FFmpeg. Please try again.');
    }
  }

  private updateProgress(phase: 'generating' | 'processing' | 'complete', progress: number, step: string) {
    this.onProgress?.({
      phase,
      progress,
      currentStep: step
    });
  }

  async generateVideo(settings: VideoGenerationSettings): Promise<string> {
    try {
      // Initialize FFmpeg
      await this.init();
      if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

      console.log('Starting video generation with settings:', settings);

      // Generate frames
      const images: string[] = [];
      const frameCount = Math.ceil((settings.duration || 10) * 24); // 24fps
      
      this.updateProgress('generating', 0, 'Generating frames...');
      
      for (let i = 0; i < frameCount; i++) {
        this.updateProgress('generating', (i / frameCount) * 50, `Generating frame ${i + 1}/${frameCount}`);
        
        const imageUrls = await generateImage(settings.prompt || '', {
          count: 1,
          creativity: settings.creativity,
          style: settings.style
        });
        
        if (!imageUrls?.[0]) {
          throw new Error('Failed to generate image');
        }
        
        images.push(imageUrls[0]);
        
        // Add small delay between frames to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('Generated frames:', images.length);

      // Write frames to FFmpeg
      this.updateProgress('processing', 50, 'Processing frames...');
      
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        if (!response.ok) throw new Error(`Failed to fetch image ${i + 1}`);
        
        const data = await response.arrayBuffer();
        const filename = `frame${i.toString().padStart(4, '0')}.jpg`;
        await this.ffmpeg.writeFile(filename, new Uint8Array(data));
        
        this.updateProgress('processing', 50 + (i / images.length) * 25, `Processing frame ${i + 1}/${images.length}`);
      }

      // Create concat file
      const concatContent = images
        .map((_, i) => `file 'frame${i.toString().padStart(4, '0')}.jpg'`)
        .join('\n');
      await this.ffmpeg.writeFile('concat.txt', concatContent);

      // Process audio if provided
      if (settings.audio?.file) {
        await this.ffmpeg.writeFile('audio.mp3', await fetchFile(settings.audio.file));
      }

      // Build FFmpeg command
      const commands = [
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-framerate', '24'
      ];

      // Add audio if provided
      if (settings.audio?.file) {
        commands.push('-i', 'audio.mp3');
      }

      // Add filters
      const filters: string[] = [];
      
      // Size filter
      const { width, height } = this.getVideoDimensions(settings);
      filters.push(`scale=${width}:${height}`);

      // Text overlay
      if (settings.textOverlay?.enabled && settings.textOverlay.text) {
        const text = settings.textOverlay.text.replace(/'/g, "'\\''");
        const fontSize = settings.textOverlay.size || 48;
        const fontColor = settings.textOverlay.color || 'white';
        const bgColor = settings.textOverlay.backgroundColor || 'black@0.5';
        
        filters.push(
          `drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${fontColor}:` +
          `box=1:boxcolor=${bgColor}:x=(w-text_w)/2:y=(h-text_h)/2`
        );
      }

      if (filters.length > 0) {
        commands.push('-vf', filters.join(','));
      }

      // Output settings
      commands.push(
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        settings.audio?.file ? '-c:a' : '-an', 'aac',
        '-movflags', '+faststart',
        '-y',
        'output.mp4'
      );

      console.log('Running FFmpeg command:', commands.join(' '));

      // Run FFmpeg
      this.updateProgress('processing', 75, 'Generating video...');
      await this.ffmpeg.exec(commands);

      // Read output
      const data = await this.ffmpeg.readFile('output.mp4');
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      this.updateProgress('complete', 100, 'Video generation complete');
      
      console.log('Video generation completed successfully');
      return url;

    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  private getVideoDimensions(settings: VideoGenerationSettings) {
    if (settings.customDimensions) {
      return settings.customDimensions;
    }

    switch (settings.videoSize) {
      case 'portrait-tiktok':
      case 'portrait-hd':
        return { width: 1080, height: 1920 };
      case 'square-1080':
        return { width: 1080, height: 1080 };
      case 'landscape-4k':
        return { width: 3840, height: 2160 };
      default: // landscape-hd
        return { width: 1920, height: 1080 };
    }
  }
}