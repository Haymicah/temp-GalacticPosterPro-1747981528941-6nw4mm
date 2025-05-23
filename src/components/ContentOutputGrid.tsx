import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { 
  Download, Edit, Share2, Heart, 
  Bookmark, ExternalLink, Copy, 
  Video, Image as ImageIcon, FileText,
  Clock, Calendar, Trash2, Send,
  Settings2, Check, RefreshCw
} from 'lucide-react';
import { ContentResponse } from '../types/content';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface ContentOutputGridProps {
  outputs: ContentResponse[];
  onEdit?: (content: ContentResponse) => void;
  onDelete?: (content: ContentResponse) => void;
  onDownload?: (content: ContentResponse) => void;
  onShare?: (content: ContentResponse) => void;
  onPostNow?: (content: ContentResponse) => void;
  onConfigureImage?: (content: ContentResponse) => void;
}

export function ContentOutputGrid({ 
  outputs,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onPostNow,
  onConfigureImage
}: ContentOutputGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCopy = async (content: ContentResponse) => {
    let textToCopy = editedContent[content.id] || content.content;

    // For image content, format with actual link
    if (content.type === 'image') {
      textToCopy = textToCopy.replace('[Link]', content.link || 'https://example.com');
    }

    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(content.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (content: ContentResponse) => {
    if (content.type === 'image' && contentRefs.current[content.id]) {
      try {
        const element = contentRefs.current[content.id];
        if (!element) return;

        const canvas = await html2canvas(element, {
          backgroundColor: '#000000',
          scale: 2,
          logging: false
        });

        const link = document.createElement('a');
        link.download = `post-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    } else if (onDownload) {
      onDownload(content);
    } else if (content.images?.[0]) {
      const link = document.createElement('a');
      link.href = content.images[0];
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePostNow = async (content: ContentResponse) => {
    if (!onPostNow) return;
    
    setPostingId(content.id);
    try {
      await onPostNow({
        ...content,
        content: editedContent[content.id] || content.content
      });
    } finally {
      setPostingId(null);
    }
  };

  const handleEdit = (content: ContentResponse) => {
    setEditingId(content.id);
    setEditedContent(prev => ({
      ...prev,
      [content.id]: prev[content.id] || content.content
    }));
  };

  const handleSaveEdit = (content: ContentResponse) => {
    setEditingId(null);
    if (onEdit) {
      onEdit({
        ...content,
        content: editedContent[content.id] || content.content
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
      {outputs.map((output) => (
        <motion.div
          key={output.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "bg-terminal-darkGreen rounded-lg overflow-hidden",
            "border border-terminal-green/30 hover:border-terminal-green transition-colors"
          )}
          ref={el => contentRefs.current[output.id] = el}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {output.type === 'video' && <Video className="w-5 h-5" />}
                {output.type === 'image' && <ImageIcon className="w-5 h-5" />}
                {output.type === 'blog' && <FileText className="w-5 h-5" />}
                <span className="text-sm capitalize">{output.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                {output.type === 'image' && (
                  <button
                    onClick={() => handleDownload(output)}
                    className="p-2 hover:bg-terminal-black rounded-full"
                    title="Download as image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleCopy(output)}
                  className="p-2 hover:bg-terminal-black rounded-full"
                  title="Copy text"
                >
                  {copiedId === output.id ? (
                    <Check className="w-4 h-4 text-terminal-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {editingId === output.id ? (
              <textarea
                value={editedContent[output.id]}
                onChange={(e) => setEditedContent(prev => ({
                  ...prev,
                  [output.id]: e.target.value
                }))}
                className="w-full h-32 bg-terminal-black text-terminal-green p-2 rounded mb-4 font-mono text-sm"
                autoFocus
              />
            ) : (
              <div className="space-y-4">
                {output.images?.[0] && (
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={output.images[0]} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="prose prose-invert max-w-none">
                  {(editedContent[output.id] || output.content)
                    .split(/(?=#|\[Link\])/g)
                    .map((part, index) => {
                      if (part.startsWith('#')) {
                        return <strong key={index} className="text-terminal-green">{part} </strong>;
                      }
                      if (part.includes('[Link]')) {
                        return (
                          <span key={index}>
                            {part.replace('[Link]', 
                              <a 
                                href={output.link || 'https://example.com'} 
                                className="underline text-terminal-green"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {output.link || 'https://example.com'}
                              </a>
                            )}
                          </span>
                        );
                      }
                      return <span key={index}>{part}</span>;
                    })}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-terminal-green/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {editingId === output.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(output)}
                        className="px-3 py-1 bg-terminal-green text-black rounded text-sm font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 border border-terminal-green rounded text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(output)}
                        className="p-1 hover:bg-terminal-black rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePostNow(output)}
                        disabled={postingId === output.id}
                        className={cn(
                          "p-1 rounded",
                          postingId === output.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-terminal-black"
                        )}
                      >
                        {postingId === output.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
                <div className="text-xs opacity-75">
                  {output.scheduledTime ? (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(output.scheduledTime), 'PPp')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(output.timestamp), 'PPp')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}