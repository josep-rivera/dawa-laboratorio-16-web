import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-4xl">📦</div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{product.category}</span>
        )}
        <h3 className="font-semibold text-gray-900 mt-1 mb-1 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
