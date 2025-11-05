export type Experience = {
  _id: string;       // Mongo id
  title: string;
  slug: string;
  description: string;
  price: number;     // in ₹
  images?: string[];
};

export type Slot = {
  _id: string;
  experienceId: string;
  date: string;
  capacity: number;
  booked: number;
  priceDelta?: number;
};

export type Booking = {
  _id?: string;
  slotId: string;
  name: string;
  email: string;
  phone?: string;
  qty: number;
  promoCode?: string;
  totalPrice?: number;
};
