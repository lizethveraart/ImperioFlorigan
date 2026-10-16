import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminAuthOpen, setIsAdminAuthOpen, loginAsAdmin } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAdminAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginAsAdmin(email, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail('');
        setPassword('');
      }, 700);
    } else {
      setError(result.error || 'Credenciales no autorizadas.');
    }
  };

  const handlePrefill = () => {
    setEmail('ventas@imperioflorigan.com');
    setPassword('EriPerVan#27');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#141211] text-white rounded-3xl shadow-2xl overflow-hidden border border-[#b3925d]/50">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminAuthOpen(false);
            setError(null);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-[#b3925d]/30 bg-gradient-to-b from-[#1c1917] to-[#141211]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b3925d] via-[#ecd08c] to-[#d4145a] p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-[#b3925d]/20 mb-3">
            <div className="w-full h-full bg-[#141211] rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#ecd08c]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#b3925d]/20 border border-[#b3925d]/40 text-[#ecd08c] text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Acceso Administrativo Exclusivo</span>
          </div>

          <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
            Panel de Control Central
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Gestión de inventarios, subida de fotos, catálogo y modificación de costos de paqueterías.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Acceso concedido. Entrando al panel administrativo...</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase text-[#ecd08c] tracking-wider block mb-1">
              Correo Administrativo Oficial
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3925d]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ventas@imperioflorigan.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-zinc-700 focus:border-[#ecd08c] text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ecd08c]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-[#ecd08c] tracking-wider block mb-1">
              Contraseña Maestra
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3925d]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-zinc-700 focus:border-[#ecd08c] text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ecd08c]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Prefill for Admin convenience */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span>¿Eres administradora?</span>
            <button
              type="button"
              onClick={handlePrefill}
              className="text-[#ecd08c] hover:underline font-semibold"
            >
              Completar credenciales oficiales
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b3925d] via-[#ecd08c] to-[#b3925d] text-[#141211] font-cinzel font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#b3925d]/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Shield className="w-4 h-4" />
            <span>Ingresar como Administrador</span>
          </button>
        </form>

        <div className="p-3 bg-black/40 text-center text-[10px] text-zinc-500 border-t border-white/5">
          Imperio Florigan • Acceso protegido con cifrado y permisos de administración
        </div>
      </div>
    </div>
  );
};
