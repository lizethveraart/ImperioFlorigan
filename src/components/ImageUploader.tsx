import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (urlOrBase64: string) => void;
  label?: string;
}

const PRESET_IMAGES = [
  { label: 'Crema / Tarro Facial', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80' },
  { label: 'Shampoo / Botella', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Serum Gotero', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80' },
  { label: 'Aceite Esencial', url: 'https://images.unsplash.com/photo-1608248597359-079633391740?auto=format&fit=crop&w=600&q=80' },
  { label: 'Gel Corporal / Herbolario', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
  { label: 'Crema Corporal Botánica', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bálsamo / Ungüento', url: 'https://images.unsplash.com/photo-1512290900672-1f5be4eb9d1b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Frasco Saludable Polvo', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Fotografía del Producto',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen no debe pesar más de 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
          {label} *
        </label>
        <span className="text-[10px] text-[#b3925d] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Alta Calidad Florigan
        </span>
      </div>

      {/* Main Preview and Upload Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
        
        {/* Thumbnail Preview Box */}
        <div className="relative aspect-square w-full sm:w-auto bg-white rounded-xl border border-zinc-200 overflow-hidden flex items-center justify-center group shadow-inner">
          {value ? (
            <>
              <img
                src={value}
                alt="Vista previa"
                className="w-full h-full object-contain p-1.5 transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all opacity-90 group-hover:opacity-100"
                title="Quitar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="text-center p-2 text-zinc-400">
              <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40 text-[#b3925d]" />
              <span className="text-[10px] block leading-tight font-medium">Sin fotografía asignada</span>
            </div>
          )}
        </div>

        {/* Upload Controls & Methods */}
        <div className="sm:col-span-2 flex flex-col justify-between space-y-2">
          
          {/* Method Selector Tabs */}
          <div className="flex bg-white rounded-xl p-0.5 border border-zinc-200 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                tab === 'upload' ? 'bg-[#141211] text-[#ecd08c]' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Upload className="w-3 h-3" /> Subir Archivo
            </button>
            <button
              type="button"
              onClick={() => setTab('url')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                tab === 'url' ? 'bg-[#141211] text-[#ecd08c]' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <LinkIcon className="w-3 h-3" /> Enlace / URL
            </button>
            <button
              type="button"
              onClick={() => setTab('presets')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                tab === 'presets' ? 'bg-[#141211] text-[#ecd08c]' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3 h-3" /> Galería
            </button>
          </div>

          {/* Tab 1: File Upload & Drag-and-drop */}
          {tab === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-[#d4145a] bg-[#d4145a]/5'
                  : 'border-zinc-300 hover:border-[#b3925d] bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-5 h-5 mx-auto text-[#d4145a] mb-1" />
              <div className="text-xs font-bold text-zinc-800">
                Haz clic para subir o arrastra tu foto aquí
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Formatos: JPG, PNG, WEBP (Hasta 8MB). Se procesa al instante.
              </p>
            </div>
          )}

          {/* Tab 2: Custom URL input */}
          {tab === 'url' && (
            <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-zinc-200">
              <label className="text-[10px] text-zinc-500 font-bold block">
                Pega la URL directa de la imagen:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/producto.jpg"
                  className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 bg-[#d4145a] hover:bg-[#b80f4c] text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Curated Gallery Presets */}
          {tab === 'presets' && (
            <div className="bg-white p-2 rounded-xl border border-zinc-200">
              <div className="text-[10px] text-zinc-500 font-bold mb-1.5">
                Selecciona una imagen botánica oficial:
              </div>
              <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto">
                {PRESET_IMAGES.map((preset, idx) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChange(preset.url)}
                      className={`relative aspect-square rounded-lg border overflow-hidden p-0.5 transition-all ${
                        isSelected
                          ? 'border-[#d4145a] ring-2 ring-[#d4145a]'
                          : 'border-zinc-200 hover:border-zinc-400'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover rounded"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#d4145a]/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
