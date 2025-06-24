import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, Filter, Search, Tag, 
  Package, Truck, Star, Plus, Minus
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  description: string;
}

export function StoreView() {
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'Water Softener System',
      category: 'softeners',
      price: 899.99,
      image: 'https://images.pexels.com/photos/6913135/pexels-photo-6913135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.8,
      stock: 12,
      description: 'High-efficiency water softener system for residential use. Removes hard minerals and improves water quality.'
    },
    {
      id: '2',
      name: 'Reverse Osmosis System',
      category: 'filtration',
      price: 349.99,
      image: 'https://images.pexels.com/photos/6913188/pexels-photo-6913188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.7,
      stock: 8,
      description: 'Under-sink reverse osmosis system with 5-stage filtration. Removes contaminants and improves taste.'
    },
    {
      id: '3',
      name: 'UV Water Purifier',
      category: 'purification',
      price: 199.99,
      image: 'https://images.pexels.com/photos/6913193/pexels-photo-6913193.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.5,
      stock: 15,
      description: 'UV light water purification system. Kills bacteria and viruses without chemicals.'
    },
    {
      id: '4',
      name: 'Whole House Filter',
      category: 'filtration',
      price: 599.99,
      image: 'https://images.pexels.com/photos/6913183/pexels-photo-6913183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.9,
      stock: 6,
      description: 'Complete whole house water filtration system. Removes sediment, chlorine, and contaminants.'
    },
    {
      id: '5',
      name: 'Water Test Kit',
      category: 'accessories',
      price: 49.99,
      image: 'https://images.pexels.com/photos/6913138/pexels-photo-6913138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.3,
      stock: 25,
      description: 'Professional water testing kit. Tests for hardness, pH, chlorine, and contaminants.'
    },
    {
      id: '6',
      name: 'Replacement Filters (3-Pack)',
      category: 'accessories',
      price: 79.99,
      image: 'https://images.pexels.com/photos/6913141/pexels-photo-6913141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.6,
      stock: 30,
      description: 'Replacement filter cartridges for RO systems. 3-pack includes sediment, carbon, and post filters.'
    }
  ];
  
  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };
  
  // Remove product from cart
  const removeFromCart = (productId: string) => {
    const existingItem = cartItems.find(item => item.product.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    }
  };
  
  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Supply Store</h1>
        
        <div className="relative">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
          </Button>
          
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        <Button 
          variant={activeCategory === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveCategory('all')}
        >
          All
        </Button>
        <Button 
          variant={activeCategory === 'softeners' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveCategory('softeners')}
        >
          Softeners
        </Button>
        <Button 
          variant={activeCategory === 'filtration' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveCategory('filtration')}
        >
          Filtration
        </Button>
        <Button 
          variant={activeCategory === 'purification' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveCategory('purification')}
        >
          Purification
        </Button>
        <Button 
          variant={activeCategory === 'accessories' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveCategory('accessories')}
        >
          Accessories
        </Button>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{product.name}</h3>
                <Badge>{product.category}</Badge>
              </div>
              
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-sm text-slate-500">{product.stock} in stock</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                <Button onClick={() => addToCart(product)}>Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-slate-500">${product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="flex h-8 w-8 items-center justify-center border-y border-slate-200">
                        {quantity}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => addToCart(product)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">Save for Later</Button>
                <Button className="flex-1">Checkout</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
