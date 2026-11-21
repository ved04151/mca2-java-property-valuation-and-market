import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';
import { Button, Input, Label } from './ui';

export function ImageUpload({ images = [], onChange, maxImages = 6 }) {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (images.length >= maxImages) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange([...images, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlField(false);
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Property Gallery ({images.length}/{maxImages})</Label>
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlField ? 'Hide URL Input' : 'Add by Web URL'}
        </button>
      </div>

      {showUrlField && (
        <div className="flex gap-2 p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl">
          <Input
            placeholder="Paste image link (e.g. https://images.unsplash.com/...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" size="sm" onClick={handleAddUrl} disabled={!urlInput.trim()}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      )}

      {/* Grid of uploaded images + drag drop tile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group relative h-28 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-sm"
          >
            <img
              src={img}
              alt={`Property preview ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {idx === 0 && (
              <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-blue-600/90 text-white px-1.5 py-0.5 rounded shadow">
                Cover Photo
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition group">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition mb-1" />
            <span className="text-xs text-slate-300 font-medium group-hover:text-white">Upload File</span>
            <span className="text-[10px] text-slate-500">JPG, PNG, WEBP</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
