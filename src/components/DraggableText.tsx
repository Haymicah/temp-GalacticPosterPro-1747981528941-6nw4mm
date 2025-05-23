import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TextOverlay } from '../types/image';
import { cn } from '../lib/utils';

interface DraggableTextProps {
  textOverlay: TextOverlay;
  containerDimensions: { width: number; height: number };
}

export function DraggableText({ textOverlay, containerDimensions }: DraggableTextProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-text',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const textStyle = {
    fontFamily: textOverlay.font,
    fontSize: `${textOverlay.size}px`,
    color: textOverlay.color,
    backgroundColor: textOverlay.backgroundColor,
    padding: `${textOverlay.padding}px`,
    textShadow: textOverlay.shadow?.enabled
      ? `${textOverlay.shadow.offset}px ${textOverlay.shadow.offset}px ${textOverlay.shadow.blur}px ${textOverlay.shadow.color}`
      : undefined,
    maxWidth: `${containerDimensions.width * 0.8}px`,
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        top: textOverlay.coordinates?.y || '50%',
        left: textOverlay.coordinates?.x || '50%',
        transform: `translate(-50%, -50%) ${style?.transform || ''}`,
        zIndex: 10,
      }}
      {...listeners}
      {...attributes}
      className={cn(
        "select-none rounded transition-shadow",
        "hover:ring-2 hover:ring-terminal-green"
      )}
    >
      <div style={textStyle}>
        {textOverlay.text || "Sample Text"}
      </div>
    </div>
  );
}