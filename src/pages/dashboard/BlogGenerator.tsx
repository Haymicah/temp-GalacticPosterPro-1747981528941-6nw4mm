import React from 'react';
import { BlogGenerator as BlogGeneratorComponent } from '../../components/BlogGenerator';

export default function BlogGenerator() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-terminal-green">Blog Generator</h1>
      <BlogGeneratorComponent />
    </div>
  );
}