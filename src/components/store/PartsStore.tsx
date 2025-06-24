import { useState } from 'react';
import { mockProducts } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface PartsStoreProps {
  onCartUpdate: (items: any[]) => void;
}

export function PartsStore({ onCartUpdate }: PartsStoreProps) {
  const [cart, setCart] = useState<{id: string, quantity: number}[]>([]);

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => 
          item.id === productId ? {...item, quantity: item.quantity + 1} : item
        );
      }
      return [...prev, {id: productId, quantity: 1}];
    });
    onCartUpdate(cart);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Parts Store</h1>
        <Button variant="outline" className="clay-button">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map(product => (
          <Card key={product.id} className="clay-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <p className="text-sm text-slate-600">{product.category}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <p className="text-slate-600">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${product.price}</span>
                <Button 
                  onClick={() => addToCart(product.id)} 
                  size="sm" 
                  className="clay-button bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
