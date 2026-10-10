import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductPresentation } from '../types';
import { ProductDetailModal } from './ProductDetailModal';
import { Search, ShoppingBag, Eye, Sparkles, AlertTriangle, Check, Send } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { products, addToCart, currentUser } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedLine, setSelectedLine] = useState<string>('Todas');
  const [activePresMap, setActivePresMap] = useState<Record<string, ProductPresentation>>({});

  // Unique lines
  const lines = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.line)));
    return ['Todas', ...list];
  }, [products]);

  const categories = ['Todas', 'Facial', 'Capilar', 'Corporal', 'Salud & Bienestar', 'Fragancias & Feromonas', 'Bebé'];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyIngredients.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesLine = selectedLine === 'Todas' || p.line === selectedLine;

      return matchesSearch && matchesCategory && matchesLine;
    });
  }, [products, searchQuery, selectedCategory, selectedLine]);

  const getActivePresentation = (product: Product): ProductPresentation => {
    return activePresMap[product.id] || product.presentations[0];
  };

  const setProductActivePres = (productId: string, pres: ProductPresentation, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePresMap(prev => ({ ...prev, [productId]: pres }));
  };

  return (
    <div className="pb-24">
      {/* Imperial Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 imperial-dark-gradient text-white shadow-2xl border border-[#b3925d]/40 p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#b3925d]/40 text-[#ecd08c] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#ecd08c]" />
            <span>Medio Siglo Amando la Naturaleza (1975 - 2025)</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide text-[#ecd08c] leading-tight">
            ¡Bienvenida, {currentUser.role === 'vendedor' ? 'Emperatriz' : 'Estimada Cliente'}!
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed font-light max-w-xl">
            {currentUser.role === 'vendedor'
              ? 'Gestiona pedidos de tus clientes en tiempo real, cotiza envíos nacionales por peso y accede al catálogo oficial con tu margen de ganancia del 35% al 40%.'
              : 'Descubre los elixires botánicos y fórmulas herbolarias de la más alta pureza para el cuidado integral de tu cuerpo y cutis.'}
          </p>

          {/* Quick Search inside hero */}
          <div className="mt-5 relative max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3925d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por producto, extracto (Baba de Caracol, Retinol, Árnica, Bergamota)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-[#b3925d]/40 text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ecd08c] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Decorative Golden Flower Watermark */}
        <div className="absolute right-[-20px] bottom-[-20px] text-[180px] sm:text-[240px] text-[#b3925d]/10 select-none pointer-events-none font-serif leading-none">
          ✿
        </div>
      </section>

      {/* Horizontal Line Scroller */}
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Líneas del Catálogo Oficial
          </span>
          <span className="text-xs text-[#b3925d] font-semibold">
            {filteredProducts.length} productos disponibles
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {lines.map(line => {
            const isSelected = selectedLine === line;
            return (
              <button
                key={line}
                onClick={() => setSelectedLine(line)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#141211] text-[#ecd08c] border border-[#b3925d]'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                }`}
              >
                {line === 'Todas' ? '✦ Todas las Líneas' : line}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-3 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-[#d4145a] text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center my-6">
            <p className="text-zinc-500 text-sm">No encontramos productos con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
                setSelectedLine('Todas');
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#b3925d] text-[#141211] font-bold text-xs"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map(product => {
              const activePres = getActivePresentation(product);
              const isLowStock = activePres.stock <= 5;
              const isOut = activePres.stock === 0;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-[#b3925d]/50 p-3 sm:p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">
                      {product.code}
                    </span>
                    {isLowStock && !isOut && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200 flex items-center gap-0.5 text-[9px]">
                        <AlertTriangle className="w-2.5 h-2.5" /> Quedan {activePres.stock}
                      </span>
                    )}
                    {isOut && (
                      <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[9px]">
                        Agotado
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square w-full bg-[#fbf9f6] rounded-xl flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain group-hover:scale-108 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Quick View Floating Eye */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-full bg-white text-[#141211] text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <Eye className="w-3 h-3" /> Ver Detalle
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-2.5 flex-1 flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-[#b3925d] font-semibold truncate">
                      {product.line}
                    </span>
                    <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#141211] line-clamp-2 mt-0.5 min-h-[32px]">
                      {product.name}
                    </h3>

                    {/* Presentation Selector Pills on Card */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.presentations.map(pres => (
                        <button
                          key={pres.sku}
                          onClick={e => setProductActivePres(product.id, pres, e)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            activePres.sku === pres.sku
                              ? 'bg-[#141211] text-[#ecd08c]'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {pres.size}
                        </button>
                      ))}
                    </div>

                    {/* Price and Profit */}
                    <div className="mt-3 pt-2 border-t border-zinc-100 flex items-end justify-between">
                      <div>
                        <div className="text-sm sm:text-base font-black text-[#d4145a]">
                          ${activePres.price} <span className="text-[10px] font-semibold text-zinc-400">MXN</span>
                        </div>
                        {currentUser.role === 'vendedor' && (
                          <div className="text-[10px] font-bold text-[#b3925d] leading-none mt-0.5">
                            Ganancia: +${activePres.price - (activePres.wholesalePrice || 0)}
                          </div>
                        )}
                      </div>

                      {/* Mini Cart Button */}
                      <button
                        disabled={isOut}
                        onClick={e => {
                          e.stopPropagation();
                          addToCart(product, activePres, 1);
                        }}
                        className="w-8 h-8 rounded-xl bg-[#141211] hover:bg-[#d4145a] text-[#ecd08c] hover:text-white flex items-center justify-center transition-all shadow-md active:scale-90 disabled:opacity-30"
                        title="Agregar al Carrito"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Product Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
