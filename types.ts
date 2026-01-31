
export type Language = 'bn' | 'en';

export interface FoodItem {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  category: string;
  image: string;
  restaurantId: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  orderId: string;
  rating: number;
  comment: string;
  userName: string;
  timestamp: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  nameBn: string;
  image: string;
  rating: number;
  deliveryTime: string;
  isOpen: boolean;
  distance: string;
  type: 'Restaurant' | 'HomeKitchen';
  menu: FoodItem[];
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export type OrderStatus = 'Confirmed' | 'Cooking' | 'On the way' | 'Delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
  address: string;
  paymentMethod: 'COD' | 'Online';
  isReviewed?: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  area: string;
  isLoggedIn: boolean;
  role: 'User' | 'Rider' | 'Merchant' | 'Admin';
}
