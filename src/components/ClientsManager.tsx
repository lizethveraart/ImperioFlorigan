import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientProfile } from '../types';
import { MEXICO_STATES } from '../data/mexicoShipping';
import { CheckoutModal } from './CheckoutModal';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Calendar,
  X,
  Plus,
} from 'lucide-react';

export const ClientsManager: React.FC = () => {
  const { clients, addClient, currentUser, setCurrentTab } = useApp();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClientIdForCheckout, setSelectedClientIdForCheckout] = useState<string | null>(null);

  // New Client Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Jalisco (Matriz Guadalajara)');
  const [postalCode, setPostalCode] = useState('');
  const [skinType, setSkinType] = useState('Cutis Mixto');
  const [notes, setNotes] = useState('');

  const filteredClients = clients.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city) {
      alert('Por favor llena los campos requeridos: Nombre, Teléfono, Dirección y Ciudad.');
      return;
    }

    addClient({
      vendorId: currentUser.id,
      fullName,
      phone,
      email,
      address,
      city,
      state,
      postalCode: postalCode || '44100',
      skinType,
      notes,
    });

    setIsAddModalOpen(false);
    // Reset form
    setFullName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setNotes('');
  };

  const openWhatsApp = (client: ClientProfile) => {
    const text = `🌸 ¡Hola ${client.fullName}! Te saluda ${currentUser.name}, tu asesora oficial de *Imperio Florigan*.\n\nTe comparto las novedades del mes con promociones especiales en nuestras líneas herbolarias. ¿Hay algún producto que desees resurtir esta semana? Con gusto te genero tu cotización con envío inmediato.`;
    const cleanPhone = client.phone.replace(/\D/g, '');
    window.open(`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#b3925d]/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d4145a]/10 flex items-center justify-center text-[#d4145a]">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141211]">
              Atención y Cartera de Clientes
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Gestiona la información de tus compradoras, registra sus preferencias dermatológicas, atiende por WhatsApp y genera pedidos directos.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#141211] text-[#ecd08c] hover:bg-[#25201d] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Nueva Clienta
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o ciudad de la clienta..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d4145a] shadow-sm"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div
            key={client.id}
            className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-sm text-[#141211]">
                    {client.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                    <Phone className="w-3 h-3 text-[#b3925d]" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b3925d]/10 text-[#8c6e3d] border border-[#b3925d]/30">
                  {client.totalOrdersCount} pedidos
                </span>
              </div>

              {/* Location */}
              <div className="mt-3 flex items-start gap-1.5 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  {client.address}, {client.city}, {client.state}
                </span>
              </div>

              {/* Skin Type & Notes */}
              <div className="mt-3 space-y-1.5 text-xs">
                {client.skinType && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Tipo de piel:</span>
                    <span className="text-[11px] font-semibold text-[#d4145a]">{client.skinType}</span>
                  </div>
                )}
                {client.notes && (
                  <p className="text-[11px] text-zinc-500 italic bg-[#faf8f5] p-2 rounded-lg border border-[#eee]">
                    "{client.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openWhatsApp(client)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </button>

              <button
                onClick={() => {
                  setSelectedClientIdForCheckout(client.id);
                  setCurrentTab('catalog');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#141211] text-[#ecd08c] hover:bg-[#25201d] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Surtir Pedido
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#b3925d]/30 text-[#1a1715]">
            <div className="p-4 sm:p-5 border-b border-zinc-200 bg-[#141211] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#ecd08c]" />
                <h3 className="font-cinzel text-base font-bold text-[#ecd08c]">
                  Registrar Nueva Clienta Florigan
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Nombre Completo *:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ej. Carmen Ortiz Del Valle"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Teléfono Celular *:
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="33 1234 5678"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Email (Opcional):
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Dirección de Entrega *:
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Calle, número exterior/interior y colonia"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Ciudad *:
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Guadalajara"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
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
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Código Postal:
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="44100"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Tipo de Piel / Cabello:
                  </label>
                  <select
                    value={skinType}
                    onChange={e => setSkinType(e.target.value)}
                    className="w-full px-2 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  >
                    <option value="Cutis Seco / Madura">Cutis Seco / Madura</option>
                    <option value="Cutis Mixto">Cutis Mixto</option>
                    <option value="Cutis Graso con Brillo">Cutis Graso con Brillo</option>
                    <option value="Sensible / Rojeces">Sensible / Rojeces</option>
                    <option value="Manchas de Sol o Paño">Manchas de Sol o Paño</option>
                    <option value="Caída de Cabello">Caída de Cabello</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Notas y Preferencias:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Ej. Prefiere fragancias suaves o cremas anti-edad"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#d4145a] text-white font-bold hover:brightness-110 shadow-lg shadow-[#d4145a]/20"
                >
                  Guardar Clienta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal if triggered */}
      {selectedClientIdForCheckout && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedClientIdForCheckout(null)}
          preselectedClientId={selectedClientIdForCheckout}
        />
      )}
    </div>
  );
};
