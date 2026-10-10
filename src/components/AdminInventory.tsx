import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductPresentation } from '../types';
import { ImageUploader } from './ImageUploader';
import {
  Shield,
  Package,
  AlertTriangle,
  Search,
  Plus,
  Users,
  X,
  Pencil,
  Trash2,
  Check,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const {
    products,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    clients,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'users'>('inventory');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Add Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState('Línea Florigan Belleza');
  const [newCategory, setNewCategory] = useState<Product['category']>('Facial');
  const [newTagline, setNewTagline] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSize, setNewSize] = useState('250 ml');
  const [newPrice, setNewPrice] = useState(250);
  const [newWeight, setNewWeight] = useState(300);
  const [newStock, setNewStock] = useState(15);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80');
  const [newIngredients, setNewIngredients] = useState('Extractos botánicos, Vitaminas');
  const [newBenefits, setNewBenefits] = useState('Nutrición profunda, Efecto visible');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.line.toLowerCase().includes(search.toLowerCase());

    if (stockFilter === 'low') {
      return matchesSearch && p.presentations.some(pres => pres.stock <= 5 && pres.stock > 0);
    }
    if (stockFilter === 'out') {
      return matchesSearch && p.presentations.some(pres => pres.stock === 0);
    }
    return matchesSearch;
  });

  const lowStockCount = products.reduce((count, p) => {
    return count + p.presentations.filter(pres => pres.stock <= 5).length;
  }, 0);

  // Handlers for Add Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const wholesale = Math.round(newPrice * 0.65);
    const pres: ProductPresentation = {
      size: newSize.trim() || '250 ml',
      price: Number(newPrice) || 100,
      wholesalePrice: wholesale,
      weightGrams: Number(newWeight) || 300,
      stock: Number(newStock) || 10,
      sku: `${newCode.trim()}-${newSize.replace(/\s+/g, '')}`,
    };

    const newProd: Product = {
      id: `flr-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      line: newLine.trim(),
      category: newCategory,
      tagline: newTagline.trim() || 'Fórmula herbolaria de alta eficacia',
      description: newDesc.trim() || 'Producto oficial Florigan para el cuidado de la salud y belleza.',
      benefits: newBenefits
        .split(',')
        .map(b => b.trim())
        .filter(Boolean),
      keyIngredients: newIngredients
        .split(',')
        .map(k => k.trim())
        .filter(Boolean),
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      presentations: [pres],
    };

    addProduct(newProd);
    setIsAddProductModalOpen(false);

    // Reset fields
    setNewCode('');
    setNewName('');
    setNewTagline('');
    setNewDesc('');
    setNewPrice(250);
    setNewStock(15);
    setNewImageUrl('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80');
  };

  // Handlers for Edit Product
  const handleOpenEdit = (product: Product) => {
    // Clone product for local editing
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`¿Estás segura de eliminar permanentemente el producto "${productName}" del catálogo?`)) {
      deleteProduct(productId);
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }
    }
  };

  const handleEditPresentationField = (
    index: number,
    field: keyof ProductPresentation,
    value: string | number
  ) => {
    if (!editingProduct) return;
    const updatedPres = [...editingProduct.presentations];
    const target = { ...updatedPres[index], [field]: value };

    // Auto recalculate wholesale if price changes
    if (field === 'price') {
      target.wholesalePrice = Math.round(Number(value) * 0.65);
    }

    updatedPres[index] = target;
    setEditingProduct({ ...editingProduct, presentations: updatedPres });
  };

  const handleAddPresentationToEditing = () => {
    if (!editingProduct) return;
    const count = editingProduct.presentations.length + 1;
    const newPres: ProductPresentation = {
      size: `${count * 250} ml`,
      price: 299,
      wholesalePrice: Math.round(299 * 0.65),
      weightGrams: 350,
      stock: 12,
      sku: `${editingProduct.code}-${count}`,
    };
    setEditingProduct({
      ...editingProduct,
      presentations: [...editingProduct.presentations, newPres],
    });
  };

  const handleRemovePresentationFromEditing = (index: number) => {
    if (!editingProduct || editingProduct.presentations.length <= 1) {
      alert('El producto debe tener al menos una presentación.');
      return;
    }
    const updatedPres = editingProduct.presentations.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, presentations: updatedPres });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#b3925d]/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#141211] text-[#ecd08c] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141211]">
              Panel Administrativo de Control
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Gestión exclusiva para administradores: edición de catálogo con fotos, control de existencias críticas, precios y directorio de usuarias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#d4145a] hover:bg-[#b80f4c] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Agregar Producto al Catálogo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-zinc-200 gap-4">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 font-cinzel text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'inventory'
              ? 'border-[#d4145a] text-[#d4145a]'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Control de Inventario & Edición ({products.length} productos)
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-cinzel text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-[#d4145a] text-[#d4145a]'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Directorio de Usuarias & Clientes ({clients.length})
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Low stock warning banner */}
          {lowStockCount > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Hay <strong>{lowStockCount} presentaciones</strong> con existencias bajas (&le; 5 piezas). El sistema genera notificaciones automáticas para resurtir.
                </span>
              </div>
              <button
                onClick={() => setStockFilter('low')}
                className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-[11px]"
              >
                Filtrar Stock Bajo
              </button>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto por código, nombre o línea para editar o ajustar..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
              />
            </div>

            <div className="flex gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  stockFilter === 'all' ? 'bg-[#141211] text-[#ecd08c]' : 'bg-white border text-zinc-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStockFilter('low')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                  stockFilter === 'low' ? 'bg-amber-600 text-white' : 'bg-white border text-zinc-600'
                }`}
              >
                <AlertTriangle className="w-3 h-3" /> Stock Bajo (&le; 5)
              </button>
              <button
                onClick={() => setStockFilter('out')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  stockFilter === 'out' ? 'bg-red-600 text-white' : 'bg-white border text-zinc-600'
                }`}
              >
                Agotados (0)
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="mt-4 bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141211] text-zinc-300 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Producto & Foto</th>
                    <th className="py-3 px-4">Presentación</th>
                    <th className="py-3 px-4">Stock Actual</th>
                    <th className="py-3 px-4">Precio Catálogo</th>
                    <th className="py-3 px-4">Mayoreo (35%)</th>
                    <th className="py-3 px-4 text-center">Ajuste Rápido</th>
                    <th className="py-3 px-4 text-center">Editar Producto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.map(prod =>
                    prod.presentations.map((pres, presIdx) => {
                      const isLow = pres.stock <= 5;
                      const isZero = pres.stock === 0;

                      return (
                        <tr key={pres.sku} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-11 h-11 bg-white rounded-xl border border-zinc-200 overflow-hidden shrink-0 p-1 flex items-center justify-center shadow-sm">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-[#b3925d] font-bold block uppercase tracking-wider">
                                  {prod.code} • {prod.line}
                                </span>
                                <span className="font-bold text-zinc-800 text-xs block">
                                  {prod.name}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                              {pres.size}
                            </span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">
                              {(pres.weightGrams / 1000).toFixed(2)} kg
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                                  isZero
                                    ? 'bg-red-100 text-red-800'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {pres.stock} pzas
                              </span>
                              {isLow && !isZero && (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-[#d4145a]">
                            ${pres.price} MXN
                          </td>

                          <td className="py-3 px-4 font-bold text-[#8c6e3d]">
                            ${pres.wholesalePrice || Math.round(pres.price * 0.65)} MXN
                          </td>

                          {/* Quick Adjust Buttons */}
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => updateProductStock(prod.id, pres.sku, pres.stock - 1)}
                                className="w-7 h-7 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 transition-colors"
                                title="Reducir 1 pieza"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateProductStock(prod.id, pres.sku, pres.stock + 5)}
                                className="px-2 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-[11px] transition-colors"
                                title="Resurtir +5 piezas"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => updateProductStock(prod.id, pres.sku, pres.stock + 20)}
                                className="px-2 h-7 rounded-lg bg-[#141211] hover:bg-[#25201d] text-[#ecd08c] font-bold text-[11px] transition-colors"
                                title="Resurtir +20 piezas"
                              >
                                +20
                              </button>
                            </div>
                          </td>

                          {/* Edit Product Action (Only on first presentation to prevent clutter) */}
                          <td className="py-3 px-4 text-center">
                            {presIdx === 0 ? (
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="px-3 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#b3925d]/10 border border-[#b3925d]/40 text-[#8c6e3d] font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition-colors shadow-sm"
                                title="Editar detalles, fotografías y presentaciones del producto"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="text-zinc-400 hover:text-[#8c6e3d] p-1 transition-colors"
                                title="Editar producto"
                              >
                                <Pencil className="w-3 h-3 mx-auto" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Users Directory */
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(cl => (
            <div key={cl.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-cinzel font-bold text-sm text-[#141211]">{cl.fullName}</h4>
                  <p className="text-zinc-500 text-[11px]">{cl.email || 'Sin correo'}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  Activa
                </span>
              </div>
              <div className="text-zinc-600">
                <strong>Teléfono:</strong> {cl.phone}
              </div>
              <div className="text-zinc-600">
                <strong>Ubicación:</strong> {cl.city}, {cl.state}
              </div>
              <div className="pt-2 border-t border-zinc-100 flex justify-between font-semibold">
                <span className="text-zinc-500">Total Comprado:</span>
                <span className="text-[#d4145a] font-bold">${cl.totalSpent.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: AGREGAR PRODUCTO AL CATÁLOGO ================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-[#b3925d]/40 text-[#1a1715] shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d4145a]/10 text-[#d4145a] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-cinzel font-bold text-lg text-[#141211]">
                  Subir Nuevo Producto al Catálogo Florigan
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              {/* Image Uploader Component */}
              <ImageUploader
                value={newImageUrl}
                onChange={setNewImageUrl}
                label="Fotografía del Producto (Subir archivo o seleccionar de galería)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Código / Clave Oficial *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. EC-09 / ORG-12"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Categoría *:
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Product['category'])}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  >
                    <option value="Facial">Facial</option>
                    <option value="Capilar">Capilar</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Salud & Bienestar">Salud & Bienestar</option>
                    <option value="Fragancias & Feromonas">Fragancias & Feromonas</option>
                    <option value="Bebé">Bebé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Nombre del Producto *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Crema Protectora de Tepezcohuite & Caléndula"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Línea Florigan:
                  </label>
                  <input
                    type="text"
                    value={newLine}
                    onChange={e => setNewLine(e.target.value)}
                    placeholder="Ej. Línea Elementos Concentrados"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Frase o Lema Corto (Tagline):
                  </label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={e => setNewTagline(e.target.value)}
                    placeholder="Ej. Hidratación intensiva 24h y regeneración"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Descripción Detallada:
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Describe las propiedades y modo de uso del producto..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>

              {/* Ingredients & Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Ingredientes Clave (Separados por coma):
                  </label>
                  <input
                    type="text"
                    value={newIngredients}
                    onChange={e => setNewIngredients(e.target.value)}
                    placeholder="Tepezcohuite, Sábila, Colágeno..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Beneficios Principales (Separados por coma):
                  </label>
                  <input
                    type="text"
                    value={newBenefits}
                    onChange={e => setNewBenefits(e.target.value)}
                    placeholder="Regenera la piel, Disminuye líneas de expresión..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>

              {/* Initial Presentation */}
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 block">
                  Presentación Inicial de Venta:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1">Tamaño:</label>
                    <input
                      type="text"
                      value={newSize}
                      onChange={e => setNewSize(e.target.value)}
                      placeholder="250 ml / 1 Kg"
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1">Precio Catálogo ($):</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={e => setNewPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1">Peso (gramos):</label>
                    <input
                      type="number"
                      value={newWeight}
                      onChange={e => setNewWeight(Number(e.target.value))}
                      placeholder="300"
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1">Stock Inicial:</label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={e => setNewStock(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#d4145a] hover:bg-[#b80f4c] text-white font-bold uppercase tracking-wider shadow-lg shadow-[#d4145a]/25 transition-all"
                >
                  Guardar y Publicar en Catálogo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDITAR PRODUCTO COMPLETO ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 border border-[#b3925d]/40 text-[#1a1715] shadow-2xl max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#141211] text-[#ecd08c] flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-[#141211]">
                    Editar Producto: {editingProduct.name}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    ID: {editingProduct.id} • Clave: {editingProduct.code}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-4 text-xs">
              
              {/* Photo Uploader with Preview */}
              <ImageUploader
                value={editingProduct.imageUrl}
                onChange={(newUrl) => setEditingProduct({ ...editingProduct, imageUrl: newUrl })}
                label="Fotografía del Producto (Actualizar foto de bodega o catálogo)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Código Oficial:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.code}
                    onChange={e => setEditingProduct({ ...editingProduct, code: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Categoría:
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  >
                    <option value="Facial">Facial</option>
                    <option value="Capilar">Capilar</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Salud & Bienestar">Salud & Bienestar</option>
                    <option value="Fragancias & Feromonas">Fragancias & Feromonas</option>
                    <option value="Bebé">Bebé</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Línea Florigan:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.line}
                    onChange={e => setEditingProduct({ ...editingProduct, line: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Nombre Oficial del Producto:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a] font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Lema / Subtítulo (Tagline):
                </label>
                <input
                  type="text"
                  value={editingProduct.tagline}
                  onChange={e => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Descripción:
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>

              {/* Presentaciones Editor */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                    Presentaciones, Precios y Stock ({editingProduct.presentations.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPresentationToEditing}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Agregar Otra Presentación
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProduct.presentations.map((pres, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 grid grid-cols-2 sm:grid-cols-6 gap-2 items-center"
                    >
                      <div className="sm:col-span-2">
                        <label className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5">Tamaño / Nombre:</label>
                        <input
                          type="text"
                          value={pres.size}
                          onChange={e => handleEditPresentationField(idx, 'size', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5">Precio Catálogo ($):</label>
                        <input
                          type="number"
                          value={pres.price}
                          onChange={e => handleEditPresentationField(idx, 'price', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-[#d4145a]"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5">Mayoreo ($):</label>
                        <input
                          type="number"
                          value={pres.wholesalePrice || Math.round(pres.price * 0.65)}
                          onChange={e => handleEditPresentationField(idx, 'wholesalePrice', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-[#8c6e3d]"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5">Stock:</label>
                        <input
                          type="number"
                          value={pres.stock}
                          onChange={e => handleEditPresentationField(idx, 'stock', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-800"
                        />
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemovePresentationFromEditing(idx)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-200/50 transition-colors"
                          title="Eliminar presentación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar Producto
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 font-bold hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#141211] hover:bg-[#25201d] text-[#ecd08c] font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Guardar Cambios
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
