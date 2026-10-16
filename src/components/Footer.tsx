import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Shield,
  Truck,
  Heart,
  Instagram,
  Facebook,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentTab, setIsAdminAuthOpen, setIsAuthOpen, currentUser } = useApp();

  return (
    <footer className="bg-[#141211] text-white border-t border-[#b3925d]/40 relative overflow-hidden mt-12 pb-32 md:pb-12 max-w-full">
      {/* Decorative Golden Flower Watermark */}
      <div className="absolute right-[-20px] bottom-[-20px] text-[160px] sm:text-[200px] text-[#b3925d]/5 select-none pointer-events-none font-serif leading-none">
        ✿
      </div>

      {/* Golden Highlight Accent Strip */}
      <div className="h-1 bg-gradient-to-r from-[#8c6e3d] via-[#ecd08c] to-[#d4145a]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Heritage */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#b3925d] via-[#ecd08c] to-[#d4145a] p-0.5 flex items-center justify-center shadow-lg shadow-[#b3925d]/20">
                <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
                  <span className="font-cinzel font-bold text-lg text-[#ecd08c]">F</span>
                </div>
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold tracking-widest text-[#ecd08c]">
                  IMPERIO FLORIGAN
                </h3>
                <p className="text-[10px] tracking-[0.2em] text-[#b3925d] uppercase -mt-0.5">
                  Cosmética & Herbolaria 1975
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Desde hace medio siglo transformando las bondades botánicas de México en elixires capilares, faciales y corporales de pureza imperial.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#b3925d]/30 text-[#ecd08c] text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#ecd08c]" />
              <span>50 Años de Tradición (1975 - 2025)</span>
            </div>
          </div>

          {/* Col 2: Redes Sociales Oficiales */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#ecd08c] border-b border-[#b3925d]/30 pb-2">
              Redes Sociales Oficiales
            </h4>
            <p className="text-xs text-zinc-400">
              Síguenos para conocer lanzamientos, tips botánicos y testimonios:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href="https://www.instagram.com/imperioflorigan/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/50 text-zinc-300 hover:text-white transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block leading-tight">Instagram</span>
                  <span className="text-[10px] text-zinc-400">@imperioflorigan</span>
                </div>
              </a>

              <a
                href="https://www.tiktok.com/@imperiofloriganmx"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-zinc-400 text-zinc-300 hover:text-white transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-black border border-white/20 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="font-bold text-xs">TT</span>
                </div>
                <div>
                  <span className="font-bold text-white block leading-tight">TikTok</span>
                  <span className="text-[10px] text-zinc-400">@imperiofloriganmx</span>
                </div>
              </a>

              <a
                href="https://www.facebook.com/imperioflorigan"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/50 text-zinc-300 hover:text-white transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block leading-tight">Facebook</span>
                  <span className="text-[10px] text-zinc-400">/imperioflorigan</span>
                </div>
              </a>
            </div>
          </div>

          {/* Col 3: Correos & Contacto */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#ecd08c] border-b border-[#b3925d]/30 pb-2">
              Atención & Contacto Oficial
            </h4>

            <div className="space-y-2.5 text-xs text-zinc-300 pt-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#b3925d] block">
                  Información y Atención al Cliente:
                </span>
                <a
                  href="mailto:contacto@imperioflorigan.com"
                  className="flex items-center gap-2 hover:text-[#ecd08c] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#d4145a] shrink-0" />
                  <span className="font-mono text-[11px]">contacto@imperioflorigan.com</span>
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#b3925d] block">
                  Ventas y Cotizaciones:
                </span>
                <a
                  href="mailto:ventas@imperioflorigan.com"
                  className="flex items-center gap-2 hover:text-[#ecd08c] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#ecd08c] shrink-0" />
                  <span className="font-mono text-[11px]">ventas@imperioflorigan.com</span>
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#b3925d] block">
                  Teléfono de Atención:
                </span>
                <a
                  href="tel:0000000000"
                  className="flex items-center gap-2 hover:text-[#ecd08c] transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px]">000 000 0000</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <MapPin className="w-4 h-4 text-[#b3925d] shrink-0" />
                <span>Irapuato, Guanajuato, México</span>
              </div>
            </div>
          </div>

          {/* Col 4: Garantías y Enlaces Rápidos */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#ecd08c] border-b border-[#b3925d]/30 pb-2">
              Enlaces del Portal
            </h4>

            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => setCurrentTab('catalog')}
                  className="hover:text-[#ecd08c] transition-colors flex items-center gap-2"
                >
                  <span>✦ Catálogo Oficial de Productos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (currentUser.email) setCurrentTab('profile');
                    else setIsAuthOpen(true);
                  }}
                  className="hover:text-[#ecd08c] transition-colors flex items-center gap-2"
                >
                  <span>👤 Mi Panel de Cliente & Carrito</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('orders')}
                  className="hover:text-[#ecd08c] transition-colors flex items-center gap-2"
                >
                  <span>📦 Rastreo de Pedidos & Guías</span>
                </button>
              </li>
              <li className="pt-2 border-t border-white/5">
                <button
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1 text-[10px]"
                >
                  <Shield className="w-3 h-3 text-zinc-600" />
                  <span>Acceso administrativo</span>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-black border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Envíos directos a cualquier código postal de México</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights Notice */}
        <div className="pt-6 border-t border-white/10 text-center sm:flex sm:justify-between sm:items-center text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Imperio Florigan. Todos los derechos reservados. Irapuato, Guanajuato.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            <span>Cosmética mexicana con amor por la naturaleza</span>
            <Heart className="w-3 h-3 text-[#d4145a] fill-[#d4145a]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
