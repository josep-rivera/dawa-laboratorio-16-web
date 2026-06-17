'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

const empty = { name: '', description: '', price: '', category: '', stock: '', image_url: '' };

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') { router.push('/login'); return; }
    loadProducts();
  }, [router]);

  async function loadProducts() {
    const res = await fetch(`${apiUrl}/api/products`);
    setProducts(await res.json());
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }),
    });
    if (res.ok) {
      setMessage('Product added successfully');
      setForm(empty);
      loadProducts();
    } else {
      const d = await res.json();
      setMessage(d.message || 'Error adding product');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleDelete(id: number) {
    const token = localStorage.getItem('token');
    await fetch(`${apiUrl}/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadProducts();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Product</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Name', placeholder: 'Product name', required: true },
            { key: 'price', label: 'Price', placeholder: '0.00', required: true, type: 'number' },
            { key: 'category', label: 'Category', placeholder: 'Electronics' },
            { key: 'stock', label: 'Stock', placeholder: '0', type: 'number' },
            { key: 'image_url', label: 'Image URL', placeholder: 'https://...', col: true },
            { key: 'description', label: 'Description', placeholder: 'Product description...', col: true },
          ].map(({ key, label, placeholder, required, type, col }) => (
            <div key={key} className={col ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type || 'text'}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                required={required}
                step={type === 'number' ? 'any' : undefined}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
          <div className="sm:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
            {message && <span className="text-sm text-green-600">{message}</span>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products ({products.length})</h2>
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="text-gray-400 text-sm ml-2">{p.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">${Number(p.price).toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
