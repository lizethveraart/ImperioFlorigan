import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Info,
} from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (urlOrBase64: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  label?: string;
  maxSizeBytes?: number; // Defaults to 5MB (5 * 1024 * 1024)
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

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onValidationChange,
  label = 'Fotografía del Producto',
  maxSizeBytes = 5 * 1024 * 1024, // 5 Megabytes
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [dragOver, setDragOver] = useState(false);

  // File metadata and validation state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeFormatted: string;
    sizePercent: number;
    typeFormatted: string;
  } | null>(null);

  // Notify parent component of validation status
  useEffect(() => {
    if (onValidationChange) {
      if (validationError) {
        onValidationChange(false, validationError);
      } else {
        onValidationChange(true);
      }
    }
  }, [validationError, onValidationChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndProcessFile = (file: File) => {
    setValidationError(null);

    // 1. Validar Tipo y Formato
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isExtensionValid = ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isMimeValid && !isExtensionValid) {
      const detected = fileExtension.toUpperCase() || 'desconocido';
      const msg = `Formato ${detected} no permitido. Solo se admiten archivos JPG, JPEG, PNG, WEBP o AVIF.`;
      setValidationError(msg);
      setFileDetails(null);
      return;
    }

    // 2. Validar Tamaño Máximo (5MB)
    if (file.size > maxSizeBytes) {
      const currentSizeFormatted = formatFileSize(file.size);
      const maxSizeFormatted = formatFileSize(maxSizeBytes);
      const msg = `El archivo pesa ${currentSizeFormatted}, excediendo el límite permitido de ${maxSizeFormatted}. Por favor sube una imagen optimizada.`;
      setValidationError(msg);
      setFileDetails(null);
      return;
    }

    // Archivo válido: procesar metadata
    const sizePercent = Math.min(100, Math.round((file.size / maxSizeBytes) * 100));
    setFileDetails({
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      sizePercent,
      typeFormatted: file.type.replace('image/', '').toUpperCase() || fileExtension.replace('.', '').toUpperCase(),
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
        setValidationError(null);
      }
    };
    reader.onerror = () => {
      setValidationError('Ocurrió un error al leer el archivo. Intenta con otra imagen.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setValidationError('Por favor ingresa una URL de imagen válida.');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setValidationError('La dirección debe iniciar con https:// o http://');
      return;
    }

    setValidationError(null);
    setFileDetails({
      name: 'Enlace web externo',
      sizeFormatted: 'Remoto',
      sizePercent: 10,
      typeFormatted: 'URL',
    });
    onChange(trimmed);
  };

  const handleSelectPreset = (presetUrl: string, presetLabel: string) => {
    setValidationError(null);
    setFileDetails({
      name: presetLabel,
      sizeFormatted: 'Catálogo Florigan',
      sizePercent: 20,
      typeFormatted: 'OFICIAL',
    });
    onChange(presetUrl);
  };

  const handleRemoveImage = () => {
    onChange('');
    setFileDetails(null);
    setValidationError(null);
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-xs">
      
      {/* Label and Constraints Header */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
          {label} *
        </label>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            JPG, PNG, WEBP, AVIF (Máx. 5 MB)
          </span>
        </div>
      </div>

      {/* Main Box */}
      <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Thumbnail Preview Box with Status Overlay */}
          <div className="relative aspect-square w-full sm:w-auto bg-white rounded-xl border border-zinc-200 overflow-hidden flex items-center justify-center group shadow-inner">
            {value ? (
              <>
                <img
                  src={value}
                  alt="Vista previa de producto"
                  className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                />
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all opacity-90 group-hover:opacity-100"
                  title="Quitar imagen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Success verification stamp badge */}
                <div className="absolute bottom-1.5 left-1.5 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Verificada</span>
                </div>
              </>
            ) : (
              <div className="text-center p-2 text-zinc-400">
                <ImageIcon className="w-9 h-9 mx-auto mb-1 opacity-40 text-[#b3925d]" />
                <span className="text-[10px] block leading-tight font-medium">
                  Sin fotografía cargada
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">
                  Límite: 5 MB
                </span>
              </div>
            )}
          </div>

          {/* Upload Controls & Methods */}
          <div className="sm:col-span-2 flex flex-col justify-between space-y-2">
            
            {/* Method Selector Tabs */}
            <div className="flex bg-white rounded-xl p-0.5 border border-zinc-200 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => { setTab('upload'); setValidationError(null); }}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  tab === 'upload' ? 'bg-[#141211] text-[#ecd08c]' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Upload className="w-3 h-3" /> Subir Archivo
              </button>
              <button
                type="button"
                onClick={() => { setTab('url'); setValidationError(null); }}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  tab === 'url' ? 'bg-[#141211] text-[#ecd08c]' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <LinkIcon className="w-3 h-3" /> Enlace URL
              </button>
              <button
                type="button"
                onClick={() => { setTab('presets'); setValidationError(null); }}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  tab === 'presets' ? 'bg-[#141211] text-[#ecd08c]' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Galería Oficial
              </button>
            </div>

            {/* Tab 1: File Upload & Drag-and-drop */}
            {tab === 'upload' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                  validationError
                    ? 'border-red-400 bg-red-50/50'
                    : dragOver
                    ? 'border-[#d4145a] bg-[#d4145a]/5 scale-[1.01]'
                    : 'border-zinc-300 hover:border-[#b3925d] bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      validateAndProcessFile(e.target.files[0]);
                    }
                  }}
                />
                <Upload className="w-5 h-5 mx-auto text-[#d4145a] mb-1" />
                <div className="text-xs font-bold text-zinc-800">
                  Seleccionar o arrastrar imagen aquí
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-zinc-500">
                  <span className="font-semibold text-zinc-700">Formatos permitidos:</span>
                  <span>JPG, PNG, WEBP, AVIF</span>
                  <span>•</span>
                  <span className="font-bold text-[#b3925d]">Hasta 5 MB</span>
                </div>
              </div>
            )}

            {/* Tab 2: Custom URL input */}
            {tab === 'url' && (
              <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-zinc-200">
                <label className="text-[10px] text-zinc-500 font-bold block">
                  URL directa de la fotografía (HTTPS):
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... o https://dominio.com/foto.jpg"
                    className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-[#d4145a] hover:bg-[#b80f4c] text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Validar
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Curated Gallery Presets */}
            {tab === 'presets' && (
              <div className="bg-white p-2 rounded-xl border border-zinc-200">
                <div className="text-[10px] text-zinc-500 font-bold mb-1.5 flex items-center justify-between">
                  <span>Seleccionar imagen optimizada de Florigan:</span>
                  <span className="text-emerald-700 font-semibold text-[9px]">100% verificadas</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto">
                  {PRESET_IMAGES.map((preset, idx) => {
                    const isSelected = value === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url, preset.label)}
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

        {/* FEEDBACK VISUAL CLARO AL ADMINISTRADOR */}

        {/* 1. Error de Validación (Formato o Tamaño) */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-xs block text-red-900">
                Error en la imagen:
              </span>
              <p className="text-[11px] leading-relaxed text-red-700 mt-0.5">
                {validationError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-red-400 hover:text-red-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2. Feedback Exitoso de Archivo Verificado */}
        {fileDetails && !validationError && value && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs animate-in fade-in">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-[11px] truncate max-w-[200px] sm:max-w-[280px]">
                  {fileDetails.name}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-800 text-[9px] font-black rounded uppercase">
                  {fileDetails.typeFormatted}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800">
                {fileDetails.sizeFormatted} / 5.0 MB máx
              </span>
            </div>

            {/* Visual Size Meter Progress Bar */}
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  fileDetails.sizePercent > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.max(5, fileDetails.sizePercent)}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
