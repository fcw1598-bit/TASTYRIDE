
import React, { useState, useEffect, useMemo } from 'react';
import { TRANSLATIONS, COLORS } from './constants';
import { User, Language, Restaurant, CartItem, Order, OrderStatus, Review } from './types';
import { getAIRecommendation, chatWithAI } from './services/geminiService';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowLeftIcon, 
  PhoneIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  WifiIcon,
  StarIcon as StarOutlineIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Mock Data
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Bhai Bhai Hotel',
    nameBn: 'ভাই ভাই হোটেল',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    deliveryTime: '20-30',
    isOpen: true,
    distance: '1.2 km',
    type: 'Restaurant',
    menu: [
      { id: '101', name: 'Beef Tehari', nameBn: 'গরুর তেহারি', price: 120, category: 'Lunch', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=200', restaurantId: '1' },
      { id: '102', name: 'Mutton Kacchi', nameBn: 'খাসির কাচ্চি', price: 250, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=200', restaurantId: '1' },
      { id: '103', name: 'Dal Puri', nameBn: 'ডাল পুরি', price: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=200', restaurantId: '1' },
    ]
  },
  {
    id: '2',
    name: 'Mayer Doa Home Kitchen',
    nameBn: 'মায়ের দোয়া হোম কিচেন',
    image: 'https://images.unsplash.com/photo-1547517023-7ca0c162f816?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    deliveryTime: '30-45',
    isOpen: true,
    distance: '0.5 km',
    type: 'HomeKitchen',
    menu: [
      { id: '201', name: 'Panta Ilish', nameBn: 'পান্তা ইলিশ', price: 180, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1626509653293-3507bc673329?auto=format&fit=crop&q=80&w=200', restaurantId: '2' },
      { id: '202', name: 'Shorshe Ilish', nameBn: 'সর্ষে ইলিশ', price: 300, category: 'Lunch', image: 'https://images.unsplash.com/photo-1626509653293-3507bc673329?auto=format&fit=crop&q=80&w=200', restaurantId: '2' },
    ]
  },
  {
    id: '3',
    name: 'Al-Madina Biryani House',
    nameBn: 'আল-মদিনা বিরিয়ানি হাউজ',
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=400',
    rating: 4.3,
    deliveryTime: '25-35',
    isOpen: true,
    distance: '2.1 km',
    type: 'Restaurant',
    menu: [
      { id: '301', name: 'Chicken Biryani', nameBn: 'চিকেন বিরিয়ানি', price: 150, category: 'Lunch', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=200', restaurantId: '3' },
      { id: '302', name: 'Beef Pulao', nameBn: 'বিফ পোলাও', price: 160, category: 'Dinner', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=200', restaurantId: '3' },
    ]
  },
  {
    id: '4',
    name: 'Sagor\'s Fast Food',
    nameBn: 'সাগর ফাস্ট ফুড',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400',
    rating: 4.1,
    deliveryTime: '15-25',
    isOpen: true,
    distance: '0.8 km',
    type: 'Restaurant',
    menu: [
      { id: '401', name: 'Chicken Burger', nameBn: 'চিকেন বার্গার', price: 80, category: 'Snacks', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200', restaurantId: '4' },
      { id: '402', name: 'French Fries', nameBn: 'ফ্রেঞ্চ ফ্রাই', price: 50, category: 'Snacks', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=200', restaurantId: '4' },
    ]
  },
  {
    id: '5',
    name: 'Nani\'s Kitchen',
    nameBn: 'নানি’স কিচেন',
    image: 'https://images.unsplash.com/photo-1601050633647-3f92c450f90d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    deliveryTime: '40-60',
    isOpen: true,
    distance: '1.5 km',
    type: 'HomeKitchen',
    menu: [
      { id: '501', name: 'Bhapa Pitha', nameBn: 'ভাপা পিঠা', price: 20, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1601050633647-3f92c450f90d?auto=format&fit=crop&q=80&w=200', restaurantId: '5' },
      { id: '502', name: 'Chitoi Pitha', nameBn: 'চিতই পিঠা', price: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050633647-3f92c450f90d?auto=format&fit=crop&q=80&w=200', restaurantId: '5' },
    ]
  },
  {
    id: '6',
    name: 'Jhal Tok Mishti',
    nameBn: 'ঝাল টক মিষ্টি',
    image: 'https://images.unsplash.com/photo-1589187151003-0dd3c8cba09b?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    deliveryTime: '20-30',
    isOpen: true,
    distance: '0.3 km',
    type: 'HomeKitchen',
    menu: [
      { id: '601', name: 'Fuchka (10pcs)', nameBn: 'ফুচকা (১০ পিস)', price: 40, category: 'Snacks', image: 'https://images.unsplash.com/photo-1589187151003-0dd3c8cba09b?auto=format&fit=crop&q=80&w=200', restaurantId: '6' },
      { id: '602', name: 'Chotpoti', nameBn: 'চটপটি', price: 30, category: 'Snacks', image: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80&w=200', restaurantId: '6' },
    ]
  },
  {
    id: '7',
    name: 'Keraniganj Kacchi Ghor',
    nameBn: 'কেরানীগঞ্জ কাচ্চি ঘর',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    deliveryTime: '30-40',
    isOpen: true,
    distance: '3.5 km',
    type: 'Restaurant',
    menu: [
      { id: '701', name: 'Special Kacchi', nameBn: 'স্পেশাল কাচ্চি', price: 280, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=200', restaurantId: '7' },
      { id: '702', name: 'Borhani (1 Glass)', nameBn: 'বোরহানি (১ গ্লাস)', price: 40, category: 'Snacks', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=200', restaurantId: '7' },
    ]
  }
];

export default function App() {
  // State
  const [view, setView] = useState<'Auth' | 'Home' | 'Restaurant' | 'Cart' | 'Chat' | 'Tracking' | 'Review' | 'Admin' | 'Merchant' | 'Rider'>('Auth');
  const [lang, setLang] = useState<Language>('bn');
  const [user, setUser] = useState<User>({ id: '', phone: '', name: '', area: '', isLoggedIn: false, role: 'User' });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedOrderToReview, setSelectedOrderToReview] = useState<Order | null>(null);

  const T = TRANSLATIONS[lang];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user.isLoggedIn && isOnline) {
      fetchAISuggestion();
    }
  }, [user.isLoggedIn, isOnline]);

  const fetchAISuggestion = async () => {
    const suggestion = await getAIRecommendation('Noon', 'Keraniganj');
    setAiSuggestion(suggestion);
  };

  const getRestaurantAvgRating = (restaurantId: string) => {
    const resReviews = reviews.filter(r => r.restaurantId === restaurantId);
    if (resReviews.length === 0) {
      return MOCK_RESTAURANTS.find(r => r.id === restaurantId)?.rating || 0;
    }
    const sum = resReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / resReviews.length).toFixed(1);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  const placeOrder = () => {
    if (!isOnline) return;
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      total: cartTotal,
      status: 'Confirmed',
      timestamp: new Date(),
      address: 'Zinzira Bazar, Keraniganj',
      paymentMethod: 'COD'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('Tracking');

    // Simulate delivery sequence
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'Cooking' } : o));
    }, 3000);
    
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'On the way' } : o));
    }, 6000);

    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'Delivered' } : o));
    }, 15000);
  };

  const submitReview = (rating: number, comment: string) => {
    if (!selectedOrderToReview) return;
    
    const restaurantId = selectedOrderToReview.items[0].restaurantId;
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      restaurantId,
      orderId: selectedOrderToReview.id,
      rating,
      comment,
      userName: user.name,
      timestamp: new Date()
    };

    setReviews([...reviews, newReview]);
    setOrders(prev => prev.map(o => o.id === selectedOrderToReview.id ? { ...o, isReviewed: true } : o));
    setView('Home');
    setSelectedOrderToReview(null);
  };

  // Views Components
  const OfflineOverlay = () => {
    if (isOnline) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <WifiIcon className="w-16 h-16 text-[#FF4B2B]" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{T.offlineTitle}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {T.offlineMessage}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-[#FF4B2B] text-white rounded-2xl text-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          {T.retry}
        </button>
      </div>
    );
  };

  const ReviewView = () => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!selectedOrderToReview) return null;

    return (
      <div className="p-6 pb-32">
        <div className="flex items-center mb-8">
          <button onClick={() => setView('Tracking')} className="p-2 bg-white rounded-full shadow-md mr-4">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">{T.leaveReview}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
          <p className="text-gray-500 mb-4">{T.ratingLabel}</p>
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} onClick={() => setRating(num)}>
                {num <= rating ? (
                  <StarSolidIcon className="w-10 h-10 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-10 h-10 text-gray-300" />
                )}
              </button>
            ))}
          </div>

          <textarea 
            className="w-full p-4 border rounded-2xl h-32 outline-none focus:ring-2 focus:ring-[#FF4B2B]"
            placeholder={T.commentPlaceholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            onClick={() => submitReview(rating, comment)}
            className="w-full py-4 bg-[#FF4B2B] text-white rounded-2xl text-xl font-bold mt-8 shadow-lg"
          >
            {T.submitReview}
          </button>
        </div>
      </div>
    );
  };

  const AuthView = () => {
    const [phone, setPhone] = useState('');
    const [step, setStep] = useState(1);
    
    const handleLogin = () => {
      if (step === 1) setStep(2);
      else {
        setUser({ id: '1', phone, name: 'Tarek', area: 'Keraniganj', isLoggedIn: true, role: 'User' });
        setView('Home');
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <h1 className="text-4xl font-bold mb-2 text-[#FF4B2B]" style={{ letterSpacing: '2px' }}>{T.appName}</h1>
        <p className="text-gray-500 mb-8">{T.slogan}</p>
        
        <div className="w-full max-w-sm">
          <label className="block text-sm font-medium mb-2">{step === 1 ? T.phoneLabel : T.otpLabel}</label>
          <input 
            type="text" 
            className="w-full p-4 border rounded-xl mb-4 text-xl focus:ring-2 focus:ring-[#FF4B2B] outline-none"
            placeholder={step === 1 ? "01XXXXXXXXX" : "1234"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-[#FF4B2B] text-white rounded-xl text-xl font-bold shadow-lg"
          >
            {step === 1 ? T.login : T.verify}
          </button>
        </div>

        <div className="mt-12 flex space-x-4">
           <button onClick={() => setLang('bn')} className={`px-4 py-2 rounded ${lang === 'bn' ? 'bg-black text-white' : 'bg-gray-200'}`}>বাংলা</button>
           <button onClick={() => setLang('en')} className={`px-4 py-2 rounded ${lang === 'en' ? 'bg-black text-white' : 'bg-gray-200'}`}>English</button>
        </div>
      </div>
    );
  };

  const HomeView = () => (
    <div className="pb-24 pt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{lang === 'bn' ? `আসসালামু আলাইকুম, ${user.name}` : `Hello, ${user.name}`}</h2>
          <p className="text-gray-500 text-sm flex items-center mt-1">
            <TruckIcon className="w-4 h-4 mr-1 text-[#FF4B2B]" /> {user.area}
          </p>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] p-5 rounded-3xl text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-2 flex items-center">
             ✨ {T.aiSuggestion}
          </h3>
          <p className="text-sm opacity-90 leading-relaxed italic">
            "{aiSuggestion || T.loading}"
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <ShoppingBagIcon className="w-32 h-32" />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar py-2">
          {Object.entries(T.categories).map(([key, label]) => (
            <div key={key} className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-2">
                <img src={`https://picsum.photos/seed/${key}/64/64`} alt={label} className="w-10 h-10 rounded-lg" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Near You */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">{T.nearYou}</h3>
        <div className="space-y-4">
          {MOCK_RESTAURANTS.map(res => (
            <div 
              key={res.id} 
              onClick={() => { setSelectedRestaurant(res); setView('Restaurant'); }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-3 flex"
            >
              <img src={res.image} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                   <h4 className="font-bold text-lg">{lang === 'bn' ? res.nameBn : res.name}</h4>
                   <span className="text-xs text-[#FF4B2B] font-bold">{res.distance}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{res.type === 'HomeKitchen' ? (lang === 'bn' ? 'হোম কিচেন' : 'Home Kitchen') : (lang === 'bn' ? 'রেস্টুরেন্ট' : 'Restaurant')}</p>
                <div className="flex items-center text-xs space-x-3">
                  <span className="flex items-center text-yellow-500 font-bold">
                    <StarSolidIcon className="w-3 h-3 mr-1" /> {getRestaurantAvgRating(res.id)}
                  </span>
                  <span className="flex items-center">⏱️ {res.deliveryTime} {T.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RestaurantView = () => {
    if (!selectedRestaurant) return null;
    
    const restaurantReviews = reviews.filter(r => r.restaurantId === selectedRestaurant.id);

    return (
      <div className="pb-24">
        <div className="relative h-64">
           <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
           <button onClick={() => setView('Home')} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-lg">
             <ArrowLeftIcon className="w-6 h-6" />
           </button>
        </div>
        <div className="px-6 -mt-8 bg-white rounded-t-3xl relative z-10 pt-6">
           <h2 className="text-3xl font-bold mb-2">{lang === 'bn' ? selectedRestaurant.nameBn : selectedRestaurant.name}</h2>
           <div className="flex items-center text-gray-500 mb-6">
              <span className="mr-2">{selectedRestaurant.distance} • </span>
              <span className="flex items-center text-yellow-500 font-bold">
                <StarSolidIcon className="w-4 h-4 mr-1" /> {getRestaurantAvgRating(selectedRestaurant.id)}
              </span>
           </div>
           
           <h3 className="text-xl font-bold mb-4">মেনু</h3>
           <div className="space-y-6">
             {selectedRestaurant.menu.map(item => (
               <div key={item.id} className="flex justify-between items-center border-b pb-4 border-gray-50">
                 <div className="flex-1">
                   <h4 className="font-bold text-lg">{lang === 'bn' ? item.nameBn : item.name}</h4>
                   <p className="text-[#FF4B2B] font-bold text-lg">৳{item.price}</p>
                 </div>
                 <div className="flex items-center">
                    <img src={item.image} className="w-16 h-16 rounded-xl mr-4" />
                    <button 
                      onClick={() => addToCart(item)}
                      className="p-2 bg-[#FF4B2B] text-white rounded-full shadow-md"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                 </div>
               </div>
             ))}
           </div>

           {/* Reviews Section */}
           <div className="mt-12 border-t pt-8 pb-8">
             <h3 className="text-xl font-bold mb-6">{lang === 'bn' ? 'কাস্টমার রিভিউ' : 'Customer Reviews'}</h3>
             {restaurantReviews.length === 0 ? (
               <p className="text-gray-400 text-center py-6 italic">{T.noReviews}</p>
             ) : (
               <div className="space-y-6">
                 {restaurantReviews.map(review => (
                   <div key={review.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center">
                          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <UserIcon className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <span className="font-bold text-sm block">{review.userName}</span>
                            <span className="text-[10px] text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</span>
                          </div>
                       </div>
                       <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            i < review.rating ? (
                              <StarSolidIcon key={i} className="w-4 h-4" />
                            ) : (
                              <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
                            )
                          ))}
                       </div>
                     </div>
                     <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  const CartView = () => (
    <div className="p-6 pb-32">
       <div className="flex items-center mb-8">
          <button onClick={() => setView('Home')} className="p-2 bg-white rounded-full shadow-md mr-4">
             <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">আপনার ব্যাগ ({cart.length})</h2>
       </div>

       {cart.length === 0 ? (
         <div className="text-center py-20">
           <ShoppingBagIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
           <p className="text-gray-400">কার্ট খালি</p>
         </div>
       ) : (
         <div className="space-y-6">
           {cart.map(item => (
             <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <img src={item.image} className="w-16 h-16 rounded-xl" />
                  <div className="ml-4">
                    <h4 className="font-bold">{lang === 'bn' ? item.nameBn : item.name}</h4>
                    <p className="text-xs text-gray-400">৳{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded-lg"><MinusIcon className="w-4 h-4"/></button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded-lg"><PlusIcon className="w-4 h-4"/></button>
                </div>
             </div>
           ))}
           
           <div className="mt-8 p-4 bg-white rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between text-gray-500">
                <span>উপ-মোট</span>
                <span>৳{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ডেলিভারি চার্জ</span>
                <span>৳৩০</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>{T.total}</span>
                <span>৳{cartTotal + 30}</span>
              </div>
           </div>

           <div className="mt-6">
             <h4 className="font-bold mb-2">পেমেন্ট পদ্ধতি</h4>
             <div className="flex space-x-4">
                <button className="flex-1 p-4 border-2 border-[#FF4B2B] bg-[#FFF5F3] rounded-2xl text-sm font-bold flex items-center justify-center">
                  💵 {T.cod}
                </button>
                <button className="flex-1 p-4 border-2 border-transparent bg-gray-100 rounded-2xl text-sm font-bold flex items-center justify-center">
                  💳 অনলাইন
                </button>
             </div>
           </div>
         </div>
       )}

       {cart.length > 0 && (
         <div className="fixed bottom-24 left-6 right-6">
            <button 
              onClick={placeOrder}
              disabled={!isOnline}
              className={`w-full py-4 ${isOnline ? 'bg-[#FF4B2B]' : 'bg-gray-400'} text-white rounded-2xl text-xl font-bold shadow-xl flex justify-between px-8`}
            >
              <span>{T.checkout}</span>
              <span>৳{cartTotal + 30}</span>
            </button>
         </div>
       )}
    </div>
  );

  const TrackingView = () => {
    const latestOrder = orders[0];
    if (!latestOrder) return (
      <div className="p-6 text-center py-20">
        <TruckIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400">কোনো সক্রিয় অর্ডার নেই</p>
      </div>
    );

    const isDelivered = latestOrder.status === 'Delivered';
    const isOnTheWay = latestOrder.status === 'On the way';

    return (
      <div className="p-6">
         <div className="flex items-center mb-8">
            <button onClick={() => setView('Home')} className="p-2 bg-white rounded-full shadow-md mr-4">
               <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">{T.trackOrder}</h2>
         </div>

         <div className="bg-white rounded-3xl p-6 shadow-lg mb-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${isDelivered ? 'bg-green-50' : 'bg-[#FFF5F3] animate-pulse'}`}>
               <TruckIcon className={`w-12 h-12 ${isDelivered ? 'text-green-500' : 'text-[#FF4B2B]'}`} />
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${isDelivered ? 'text-green-500' : 'text-[#FF4B2B]'}`}>{T.status[latestOrder.status]}</h3>
            <p className="text-gray-400 text-sm">অর্ডার আইডি: #{latestOrder.id}</p>

            {isDelivered && !latestOrder.isReviewed && (
              <button 
                onClick={() => { setSelectedOrderToReview(latestOrder); setView('Review'); }}
                className="mt-6 w-full py-3 border-2 border-[#FF4B2B] text-[#FF4B2B] rounded-2xl font-bold"
              >
                {T.leaveReview}
              </button>
            )}
         </div>

         <div className="space-y-8 relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>
            
            <div className="relative">
              <div className={`absolute -left-7 w-4 h-4 rounded-full border-4 border-white bg-green-500`}></div>
              <h4 className="font-bold">অর্ডার নিশ্চিত</h4>
              <p className="text-sm text-gray-400">১০:৩০ AM</p>
            </div>
            <div className="relative">
              <div className={`absolute -left-7 w-4 h-4 rounded-full border-4 border-white ${['Cooking', 'On the way', 'Delivered'].includes(latestOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h4 className={`font-bold ${!['Cooking', 'On the way', 'Delivered'].includes(latestOrder.status) && 'text-gray-400'}`}>রান্না হচ্ছে</h4>
            </div>
            <div className="relative">
              <div className={`absolute -left-7 w-4 h-4 rounded-full border-4 border-white ${['On the way', 'Delivered'].includes(latestOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h4 className={`font-bold ${!['On the way', 'Delivered'].includes(latestOrder.status) && 'text-gray-400'}`}>পথে আছে</h4>
            </div>
            <div className="relative">
              <div className={`absolute -left-7 w-4 h-4 rounded-full border-4 border-white ${latestOrder.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h4 className={`font-bold ${latestOrder.status !== 'Delivered' && 'text-gray-400'}`}>ডেলিভারি সফল</h4>
            </div>
         </div>

         {isOnTheWay && (
           <div className="mt-12 p-4 bg-white rounded-3xl shadow-lg border border-green-50 flex items-center justify-between">
              <div className="flex items-center">
                 <img src="https://picsum.photos/seed/rider/100/100" className="w-14 h-14 rounded-full mr-4 border-2 border-green-500" />
                 <div>
                    <h4 className="font-bold">সজীব আলী</h4>
                    <p className="text-xs text-gray-400">আপনার রাইডার (নিকটবর্তী)</p>
                 </div>
              </div>
              <a 
                href="tel:+8801XXXXXXXXX"
                className="p-4 bg-green-500 text-white rounded-2xl shadow-md flex items-center space-x-2 active:scale-95 transition-transform"
              >
                 <PhoneIcon className="w-6 h-6" />
                 <span className="font-bold hidden xs:inline">{T.riderCall}</span>
              </a>
           </div>
         )}
      </div>
    );
  };

  const ChatView = () => {
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([
      { text: "আসসালামু আলাইকুম! আমি টেস্টিরাইড এআই। আপনি কি খুঁজছেন?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
      if (!isOnline) return;
      if (!input.trim()) return;
      const userMsg = input;
      setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
      setInput('');
      const reply = await chatWithAI(userMsg);
      setMessages(prev => [...prev, { text: reply, sender: 'ai' }]);
    };

    return (
      <div className="flex flex-col h-screen pb-24">
        <div className="p-6 bg-[#FF4B2B] text-white">
           <h2 className="text-xl font-bold">এআই সহকারী</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${m.sender === 'user' ? 'bg-[#FF4B2B] text-white' : 'bg-white shadow-sm'}`}>
                   {m.text}
                </div>
             </div>
           ))}
        </div>
        <div className="p-4 bg-white border-t flex space-x-2">
           <input 
             className="flex-1 p-3 border rounded-xl" 
             placeholder={isOnline ? "কিছু লিখুন..." : "ইন্টারনেট নেই"}
             value={input}
             disabled={!isOnline}
             onChange={(e) => setInput(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
           />
           <button onClick={sendMessage} disabled={!isOnline} className={`p-3 ${isOnline ? 'bg-[#FF4B2B]' : 'bg-gray-300'} text-white rounded-xl`}>
              <ShoppingBagIcon className="w-6 h-6" />
           </button>
        </div>
      </div>
    );
  };

  // Nav
  const Navbar = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-4 z-50">
      <button onClick={() => setView('Home')} className={`flex flex-col items-center ${view === 'Home' ? 'text-[#FF4B2B]' : 'text-gray-400'}`}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-bold">{T.home}</span>
      </button>
      <button onClick={() => setView('Chat')} className={`flex flex-col items-center ${view === 'Chat' ? 'text-[#FF4B2B]' : 'text-gray-400'}`}>
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-bold">এআই</span>
      </button>
      <button onClick={() => setView('Cart')} className="relative flex flex-col items-center text-gray-400">
        <div className="absolute -top-10 bg-[#FF4B2B] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
          <ShoppingBagIcon className="w-8 h-8" />
        </div>
        {cart.length > 0 && <span className="absolute -top-11 right-0 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>}
        <span className="text-[10px] mt-8 font-bold">কার্ট</span>
      </button>
      <button onClick={() => setView('Tracking')} className={`flex flex-col items-center ${['Tracking', 'Review'].includes(view) ? 'text-[#FF4B2B]' : 'text-gray-400'}`}>
        <TruckIcon className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-bold">ট্র্যাক</span>
      </button>
      <button onClick={() => setView('Auth')} className={`flex flex-col items-center text-gray-400`}>
        <UserIcon className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-bold">{T.profile}</span>
      </button>
    </nav>
  );

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen relative shadow-2xl overflow-hidden font-sans">
      <OfflineOverlay />
      {view === 'Auth' && <AuthView />}
      {view === 'Home' && <HomeView />}
      {view === 'Restaurant' && <RestaurantView />}
      {view === 'Cart' && <CartView />}
      {view === 'Chat' && <ChatView />}
      {view === 'Tracking' && <TrackingView />}
      {view === 'Review' && <ReviewView />}
      
      {view !== 'Auth' && <Navbar />}
    </div>
  );
}
