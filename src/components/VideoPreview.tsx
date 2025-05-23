import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { VideoGenerationSettings, VIDEO_DIMENSIONS, STYLE_PREVIEWS } from '../types/video';
import { PreviewDimensions } from '../types/image';

interface DraggableElementProps {
  id: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onPositionChange: (coordinates: { x: number; y: number }) => void;
}

function DraggableElement({ id, children, initialPosition, onPositionChange }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  useEffect(() => {
    if (transform) {
      setIsDragging(true);
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const deltaX = (transform.x / containerWidth) * 100;
      const deltaY = (transform.y / containerHeight) * 100;
      
      const newX = position.x + (deltaX * 0.5);
      const newY = position.y + (deltaY * 0.5);
      
      const padding = 5;
      const clampedX = Math.max(padding, Math.min(100 - padding, newX));
      const clampedY = Math.max(padding, Math.min(100 - padding, newY));
      
      onPositionChange({ x: clampedX, y: clampedY });
    } else if (isDragging) {
      setIsDragging(false);
    }
  }, [transform]);

  const style = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: transform ? 
      `translate(-50%, -50%) translate3d(${transform.x}px, ${transform.y}px, 0)` :
      'translate(-50%, -50%)',
    cursor: 'move',
    zIndex: 10,
    touchAction: 'none',
    transition: isDragging ? 'none' : 'all 0.3s ease',
    userSelect: 'none',
  } as React.CSSProperties;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="hover:ring-2 hover:ring-terminal-green rounded"
    >
      {children}
    </div>
  );
}

interface VideoPreviewProps {
  settings: VideoGenerationSettings;
  onTextMove?: (coordinates: { x: number; y: number }) => void;
  onLogoMove?: (coordinates: { x: number; y: number }) => void;
  previewVideo?: string;
}

export function VideoPreview({ settings, onTextMove, onLogoMove, previewVideo }: VideoPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState<PreviewDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 16/9
  });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;

      let { width, height, aspectRatio } = settings.customDimensions
        ? {
            width: settings.customDimensions.width,
            height: settings.customDimensions.height,
            aspectRatio: settings.customDimensions.width / settings.customDimensions.height
          }
        : VIDEO_DIMENSIONS[settings.videoSize];

      if (maxWidth / aspectRatio <= maxHeight) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setDimensions({ width, height, aspectRatio });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [settings.videoSize, settings.customDimensions]);

  const handleTextPositionChange = (coordinates: { x: number; y: number }) => {
    if (onTextMove) {
      onTextMove(coordinates);
    }
  };

  const handleLogoPositionChange = (coordinates: { x: number; y: number }) => {
    if (onLogoMove) {
      onLogoMove(coordinates);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] bg-terminal-black/50 rounded-lg overflow-hidden"
    >
      <div
        className="preview-container"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {previewVideo ? (
          <video
            src={previewVideo}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            loop
            muted
          >
            <source src={previewVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={STYLE_PREVIEWS[settings.style]}
            alt={`${settings.style} style preview`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <DndContext 
          modifiers={[restrictToParentElement]}
        >
          {settings.textOverlay?.enabled && (
            <DraggableElement
              id="draggable-text"
              initialPosition={settings.textOverlay.coordinates}
              onPositionChange={handleTextPositionChange}
            >
              <div
                style={{
                  fontFamily: settings.textOverlay.font,
                  fontSize: `${settings.textOverlay.size}px`,
                  color: settings.textOverlay.color,
                  backgroundColor: settings.textOverlay.backgroundColor,
                  padding: `${settings.textOverlay.padding}px`,
                  textShadow: settings.textOverlay.shadow?.enabled
                    ? `${settings.textOverlay.shadow.offset}px ${settings.textOverlay.shadow.offset}px ${settings.textOverlay.shadow.blur}px ${settings.textOverlay.shadow.color}`
                    : undefined,
                  maxWidth: `${dimensions.width * 0.8}px`,
                  whiteSpace: 'pre-wrap',
                  textAlign: 'center',
                  borderRadius: '4px',
                }}
                className="hover:ring-2 hover:ring-terminal-green"
              >
                {settings.textOverlay.text || "Sample Text"}
              </div>
            </DraggableElement>
          )}

          {settings.logo?.enabled && settings.logo.url && (
            <DraggableElement
              id="draggable-logo"
              initialPosition={settings.logo.coordinates}
              onPositionChange={handleLogoPositionChange}
            >
              <img
                src={settings.logo.url}
                alt="Logo"
                style={{
                  width: `${settings.logo.size}px`,
                  height: `${settings.logo.size}px`,
                  objectFit: 'contain',
                }}
                className="rounded hover:ring-2 hover:ring-terminal-green"
                draggable={false}
              />
            </DraggableElement>
          )}
        </DndContext>

        <div className="absolute bottom-2 right-2 text-xs text-terminal-green bg-black/50 px-2 py-1 rounded">
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      </div>
    </div>
  );
}