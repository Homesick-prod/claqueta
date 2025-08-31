'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileJson } from 'lucide-react';
import { Project } from '../../../types/domain';
import { importProjects } from '../../../lib/projects-local';

interface ImportProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsUpdate: (projects: Project[]) => void;
}

export default function ImportProject({ isOpen, onClose, onProjectsUpdate }: ImportProjectProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const updated = importProjects(data);
      onProjectsUpdate(updated);
      setFile(null);
      onClose();
    } catch (err) {
      setError('Invalid file format. Please select a valid JSON file.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Import Project</h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[var(--neutral-700)] hover:bg-opacity-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--brand)] transition-colors"
              >
                {file ? (
                  <>
                    <FileJson className="w-12 h-12 mx-auto mb-3 text-[var(--brand)]" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)]" />
                    <p className="font-medium">Click to select file</p>
                    <p className="text-sm text-[var(--text-muted)]">JSON format only</p>
                  </>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleImport} className="btn btn-primary" disabled={!file}>
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}