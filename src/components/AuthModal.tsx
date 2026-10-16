import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { MEXICO_STATES } from '../data/mexicoShipping';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  Sparkles,
  Heart,
  Eye,
  EyeOff,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, setCurrentUser, loginWithGoogle, setCurrentTab } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Guanajuato');
  const [city, setCity] = useState('Irapuato');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden. Por favor verifícalas.');
        return;
      }
      if (!name.trim() || !email.trim() || !password) {
        setError('Por favor llena los campos obligatorios para registrarte.');
        return;
      }

      const newClientUser: User = {
        id: `usr-cli-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: 'cliente',
        phone: phone.trim() || '000 000 0000',
        address: address.trim() || 'Domicilio Particular',
        city: city.trim() || 'Irapuato',
        state: state,
        authProvider: email.toLowerCase().includes('gmail') ? 'google' : 'email',
      };

      setCurrentUser(newClientUser);
      setIsAuthOpen(false);
      setCurrentTab('profile');
    } else {
      // Login
      if (!email.trim() || !password) {
        setError('Ingresa tu correo y contraseña para acceder.');
        return;
      }

      const loggedClient: User = {
        id: `usr-cli-${Date.now()}`,
        name: name.trim() || (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
        email: email.trim(),
        role: 'cliente',
        phone: phone.trim() || '000 000 0000',
        address: address.trim() || 'Av. Guerrero 1500, Col. Jardines',
        city: city.trim() || 'Irapuato',
        state: state,
        authProvider: email.toLowerCase().includes('gmail') ? 'google' : 'email',
      };

      setCurrentUser(loggedClient);
      setIsAuthOpen(false);
      setCurrentTab('profile');
    }
  };

  const handleGoogleQuickLogin = () => {
    loginWithGoogle('clienta.florigan@gmail.com', 'Carolina Mendoza');
    setCurrentTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e8cbb0] text-[#1a1715]">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-rose-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Feminine Header with Rose Gold & Petal Styling */}
        <div className="relative p-6 bg-gradient-to-br from-[#fff7f2] via-[#faede4] to-[#f5dfd3] text-center border-b border-[#ebd0be] overflow-hidden">
          {/* Subtle floral watermark */}
          <div className="absolute right-[-15px] top-[-10px] text-7xl text-[#d4145a]/10 pointer-events-none select-none font-serif">
            ❀
          </div>
          <div className="absolute left-[-15px] bottom-[-10px] text-7xl text-[#b3925d]/10 pointer-events-none select-none font-serif">
            ✿
          </div>

          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#d4145a] via-[#e87a90] to-[#b3925d] mx-auto p-0.5 flex items-center justify-center shadow-lg shadow-[#d4145a]/20 mb-2 relative z-10">
            <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
              <span className="font-cinzel font-bold text-xl text-[#ecd08c]">F</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 border border-[#e8b598] text-[#a10e43] text-[10px] font-bold uppercase tracking-wider mb-1.5 shadow-xs">
            <Heart className="w-3 h-3 text-[#d4145a] fill-[#d4145a]" />
            <span>Club de Belleza & Salud Florigan</span>
          </div>

          <h2 className="font-cinzel text-xl font-bold text-[#141211]">
            {mode === 'login' ? 'Bienvenida a tu Imperio' : 'Únete a Imperio Florigan'}
          </h2>
          <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
            Accede a tu panel personal, guarda tus carritos de compra y rastrea tus números de guía al instante.
          </p>
        </div>

        {/* Google 1-Click Login Option */}
        <div className="p-6 pb-4">
          <button
            type="button"
            onClick={handleGoogleQuickLogin}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-rose-50/50 border border-zinc-200 hover:border-[#d4145a]/40 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all group"
          >
            {/* Google "G" logo SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="group-hover:text-[#d4145a] transition-colors">
              Continuar con Google (Gmail)
            </span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              o con tu correo electrónico
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-[#faf4ef] p-1 rounded-2xl mb-4 border border-[#ebd0be]/50">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#d4145a] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#d4145a] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Mariana Rosas"
                    className="w-full pl-9 pr-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Correo Electrónico (Gmail o cualquier correo)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    WhatsApp / Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="33 1234 5678"
                      className="w-full pl-9 pr-2 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Estado para Envíos
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-2 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  >
                    {MEXICO_STATES.map(s => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4145a] via-[#e8226e] to-[#b3925d] text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md shadow-[#d4145a]/25 transition-all mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mode === 'login' ? 'Entrar a Mi Panel de Cliente' : 'Registrarme y Guardar Carrito'}</span>
            </button>
          </form>

          {/* Value Prop Badges */}
          <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-500">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
              <span>Carrito Guardado</span>
            </div>
            <div className="flex flex-col items-center">
              <Package className="w-3.5 h-3.5 text-[#b3925d] mb-0.5" />
              <span>Rastreo de Guías</span>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-3.5 h-3.5 text-[#d4145a] mb-0.5" />
              <span>Atención Directa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
