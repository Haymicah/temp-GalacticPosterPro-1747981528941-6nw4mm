import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { VideoGenerationSettings } from '../types/video';
import { generateImage } from './openai';

let ffmpeg: FFmpeg | null = null;

export async function initFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  try {
    await ffmpeg.load({
      coreURL: await fetch('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js').then(r => r.url),
      wasmURL: await fetch('/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm').then(r => r.url)
    });

    console.log('FFmpeg loaded successfully');
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    throw error;
  }
}

export async function generateVideo(
  prompt: string,
  settings: VideoGenerationSettings
): Promise<string> {
  try {
    console.log('Starting video generation...', { prompt, settings });
    
    // Initialize FFmpeg
    const ff = await initFFmpeg();
    
    // Generate frames using AI
    const frames = [];
    const framesCount = Math.ceil((settings.duration || 30) * 24); // 24 fps
    
    for (let i = 0; i < framesCount; i++) {
      const framePrompt = `${prompt} - frame ${i + 1} of ${framesCount} - in ${settings.style} style`;
      const imageUrls = await generateImage(framePrompt, {
        count: 1,
        creativity: settings.creativity,
        style: settings.style,
        size: settings.videoSize
      });
      
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error(`Failed to generate frame ${i + 1}`);
      }
      
      frames.push(imageUrls[0]);
      
      if (settings.onProgress) {
        settings.onProgress({
          phase: 'generating',
          progress: (i / framesCount) * 100
        });
      }
    }
    
    // Write frames to FFmpeg virtual filesystem
    for (let i = 0; i < frames.length; i++) {
      if (settings.onProgress) {
        settings.onProgress({
          phase: 'processing',
          progress: (i / frames.length) * 100
        });
      }

      const imageResponse = await fetch(frames[i]);
      const imageData = await imageResponse.arrayBuffer();
      await ff.writeFile(`frame${i.toString().padStart(4, '0')}.jpg`, new Uint8Array(imageData));
    }

    // Create concat file for frames
    const concatContent = frames
      .map((_, i) => `file 'frame${i.toString().padStart(4, '0')}.jpg'`)
      .join('\n');
    await ff.writeFile('concat.txt', concatContent);

    // Get dimensions based on settings
    let width = 1920;
    let height = 1080;
    
    if (settings.videoSize === 'portrait-tiktok' || settings.videoSize === 'portrait-hd') {
      width = 1080;
      height = 1920;
    } else if (settings.videoSize === 'square-1080') {
      width = 1080;
      height = 1080;
    }

    // Base FFmpeg command
    const commands = [
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-framerate', '24'
    ];

    // Add style-specific filters
    let filters: string[] = [];
    filters.push(`scale=${width}:${height}`);

    // Add text overlay if enabled
    if (settings.textOverlay?.enabled) {
      const text = settings.textOverlay.text || 'Sample Text';
      const fontSize = settings.textOverlay.size || 48;
      const fontColor = settings.textOverlay.color || 'white';
      const bgColor = settings.textOverlay.backgroundColor || 'black@0.5';
      
      let yPosition = '(h-text_h)/2';
      if (settings.textOverlay.position === 'top') yPosition = '20';
      if (settings.textOverlay.position === 'bottom') yPosition = 'h-text_h-20';

      filters.push(
        `drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${fontColor}:` +
        `box=1:boxcolor=${bgColor}:x=(w-text_w)/2:y=${yPosition}`
      );
    }

    // Add logo if enabled
    if (settings.logo?.enabled && settings.logo.url) {
      const logoResponse = await fetch(settings.logo.url);
      const logoData = await logoResponse.arrayBuffer();
      await ff.writeFile('logo.png', new Uint8Array(logoData));
      
      filters.push(
        `movie=logo.png[logo];[v][logo]overlay=${settings.logo.coordinates?.x || 10}:${settings.logo.coordinates?.y || 10}`
      );
    }

    // Add all filters to command
    if (filters.length > 0) {
      commands.push('-vf', filters.join(','));
    }

    // Add output settings
    commands.push(
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-movflags', '+faststart',
      '-y',
      'output.mp4'
    );

    console.log('Running FFmpeg command:', commands.join(' '));

    // Run FFmpeg command
    await ff.exec(commands);
    console.log('FFmpeg command completed');

    // Read the output file
    const data = await ff.readFile('output.mp4');
    console.log('Read output file, size:', data.length);
    
    // Create object URL
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    console.log('Created video URL:', url);

    return url;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

export async function addWatermark(videoUrl: string, watermarkText: string): Promise<string> {
  try {
    const ff = await initFFmpeg();
    
    // Write input video to FFmpeg filesystem
    const videoData = await fetchFile(videoUrl);
    await ff.writeFile('input.mp4', videoData);

    // Add watermark with shadow and background
    await ff.exec([
      '-i', 'input.mp4',
      '-vf', `drawtext=text='${watermarkText}':fontsize=24:fontcolor=white:` +
             'shadowcolor=black:shadowx=2:shadowy=2:' +
             'box=1:boxcolor=black@0.5:boxborderw=5:' +
             'x=10:y=10',
      '-c:a', 'copy',
      'output.mp4'
    ]);

    // Read output file
    const data = await ff.readFile('output.mp4');
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
}