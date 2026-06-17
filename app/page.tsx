'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/products`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => { setError('Error loading products'); setLoading(false); });
  }, []);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = category ? products.filter(p => p.category === category) : products;

  if (loading) return <div className="text-center py-20 text-gray-500">Loading products...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tech Marketplace</h1>
        <p className="text-gray-500">Find the best tech products at the best prices</p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
