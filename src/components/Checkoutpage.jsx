import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import {
  ShoppingCart,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Landmark,
  CreditCard,
  Calendar,
  Lock
} from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, buyNowItem } = useCart();

  const displayItems = buyNowItem ? [buyNowItem] : cartItems;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!/^\d{10}$/.test(form.phone)) errs.phone = '10-digit number';
    if (!form.address) errs.address = 'Required';
    if (!form.city) errs.city = 'Required';
    if (!form.state) errs.state = 'Required';
    if (!/^\d{5,6}$/.test(form.zip)) errs.zip = '5 or 6 digit zip';
    if (!/^\d{1}$/.test(form.cardNumber)) errs.cardNumber = '1 digit';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiryDate)) {
      errs.expiryDate = 'Format MM/YY';
    } else {
      const [mm, yy] = form.expiryDate.split('/');
      const expiryDate = new Date(`20${yy}`, mm);
      if (expiryDate <= new Date()) errs.expiryDate = 'Must be future';
    }
    if (!/^\d{3}$/.test(form.cvv)) errs.cvv = '3 digits';
    return errs;
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    const orderData = {
      product: {
        title: displayItems.map((i) => i.title).join(', '),
        variant: displayItems.map((i) => i.variant || 'Default').join(', '),
        quantity: displayItems.reduce((acc, item) => acc + item.quantity, 0),
        price: displayItems.reduce((acc, item) => acc + item.quantity * item.price, 0),
      },
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip
      },
      payment: {
        cardNumber: form.cardNumber,
        expiryDate: form.expiryDate,
        cvv: form.cvv
      }
    };

    try {
      await axios.post('https://esalesone-backend.onrender.com/api/orders', orderData);
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
      setLoading(false)
      window.location.href = '/thankyou'; // Redirect to thank you page
    } catch {
      setStatus('Unable to Confirm Order');
    }
  };

  const inputFields = [
    { icon: <User className="w-5 h-5 text-gray-500" />, label: 'Full Name', key: 'name' },
    { icon: <Mail className="w-5 h-5 text-gray-500" />, label: 'Email', key: 'email' },
    { icon: <Phone className="w-5 h-5 text-gray-500" />, label: 'Phone Number', key: 'phone' },
    { icon: <MapPin className="w-5 h-5 text-gray-500" />, label: 'Address', key: 'address' },
    { icon: <Building className="w-5 h-5 text-gray-500" />, label: 'City', key: 'city' },
    { icon: <Landmark className="w-5 h-5 text-gray-500" />, label: 'State', key: 'state' },
    { icon: <MapPin className="w-5 h-5 text-gray-500" />, label: 'Zip Code', key: 'zip' },
    { icon: <CreditCard className="w-5 h-5 text-gray-500" />, label: 'Card Number', key: 'cardNumber' },
    { icon: <Calendar className="w-5 h-5 text-gray-500" />, label: 'Expiry Date (MM/YY)', key: 'expiryDate' },
    { icon: <Lock className="w-5 h-5 text-gray-500" />, label: 'CVV', key: 'cvv' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
        <h2 className="mt-5 text-4xl font-bold text-center text-blue-700 mb-10 flex items-center justify-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          Checkout
        </h2>

        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">🛍️ Your Items</h3>
          <div className="space-y-4">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-xl bg-blue-50 shadow-sm"
              >
                <div>
                  <p className="font-medium text-lg text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-blue-700">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {inputFields.map(({ icon, label, key }) => (
            <div key={key}>
              <label className="block font-medium mb-1 text-gray-700 flex items-center gap-2">
                {icon}
                {label}
              </label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[key] && (
                <p className="text-sm text-red-600 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
        </form>

        <div className="mt-10 text-center">
          {
            loading ? (
              <p className="text-blue-600 font-semibold">Processing your order...</p>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 cursor-pointer"
              >
                💳 Place Order
              </button>
            )
          }


          {status === 'success' && (
            <p className="mt-4 text-green-600 font-semibold">Order placed successfully!</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-600 font-semibold">Something went wrong.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
