import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import { MEXICO_STATES } from '../data/mexicoShipping';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, setCurrentUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('vendedor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Jalisco (Matriz Guadalajara)');

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      if (!name || !email || !password) {
        alert('Por favor llena los campos requeridos.');
        return;
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        phone,
        state,
        city: 'Guadalajara',
        vendorLevel: role === 'vendedor' ? 'Emperatriz Oro' : undefined,
        commissionRate: role === 'vendedor' ? 0.35 : undefined,
        creditLimit: role === 'vendedor' ? 15000 : undefined,
        availableCredit: role === 'vendedor' ? 15000 : undefined,
      };

      setCurrentUser(newUser);
      setIsAuthOpen(false);
    } else {
      // Login
      const loggedUser: User = {
        id: `usr-${Date.now()}`,
        name: name || (email.split('@')[0] || 'Emperatriz Florigan'),
        email,
        role,
        phone: '33 1071 1718',
        state,
        city: 'Guadalajara',
        vendorLevel: role === 'vendedor' ? 'Emperatriz Oro' : undefined,
        commissionRate: role === 'vendedor' ? 0.35 : undefined,
      };

      setCurrentUser(loggedUser);
      setIsAuthOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#b3925d]/40 text-[#1a1715]">
        
        {/* Banner */}
        <div className="p-6 bg-[#141211] text-white text-center relative border-b border-[#b3925d]/40">
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#b3925d] to-[#ecd08c] mx-auto p-0.5 flex items-center justify-center shadow-lg shadow-[#b3925d]/20 mb-2">
            <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
              <span className="font-cinzel font-bold text-xl text-[#ecd08c]">F</span>
            </div>
          </div>

          <h2 className="font-cinzel text-lg font-bold text-[#ecd08c]">
            {mode === 'login' ? 'Iniciar Sesión en Imperio' : 'Crear Cuenta Florigan'}
          </h2>
          <p className="text-[11px] text-zinc-300 mt-0.5">
            Cosmética Natural y Herbolaria Mexicana Desde 1975
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-zinc-200">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'login'
                ? 'border-b-2 border-[#d4145a] text-[#d4145a] bg-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Acceso a Mi Cuenta
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'register'
                ? 'border-b-2 border-[#d4145a] text-[#d4145a] bg-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Registro de Nueva Usuaria
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          
          {/* Role selector */}
          <div>
            <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
              Perfil de Acceso:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('vendedor')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'vendedor'
                    ? 'border-[#b3925d] bg-[#b3925d]/10 text-[#8c6e3d] font-bold'
                    : 'border-zinc-200 text-zinc-600'
                }`}
              >
                <div className="text-xs">👑 Vendedora</div>
                <div className="text-[10px] text-zinc-400">35% ganancia + Pedidos</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('cliente')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'cliente'
                    ? 'border-[#d4145a] bg-[#d4145a]/10 text-[#d4145a] font-bold'
                    : 'border-zinc-200 text-zinc-600'
                }`}
              >
                <div className="text-xs">🛍️ Clienta Final</div>
                <div className="text-[10px] text-zinc-400">Compras de catálogo</div>
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Nombre y Apellidos:
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Lizeth Vera"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
              Correo Electrónico:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ejemplo@florigan.com"
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
              Contraseña Segura:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Confirmar Contraseña:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Teléfono:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="33 1071 1718"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Estado:
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-2 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  >
                    {MEXICO_STATES.map(s => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4145a]/25 hover:brightness-110 transition-all"
            >
              {mode === 'login' ? 'Entrar a la Plataforma' : 'Crear Cuenta y Comenzar'}
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cifrado y autenticación segura
            </span>
          </div>

        </form>

      </div>
    </div>
  );
};
