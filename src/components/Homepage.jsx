import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../assets/products';
import { useCart } from '../context/CartContext';
import img1 from "../assets/images/1.jpg";
import img2 from "../assets/images/2.jpg";
import img3 from "../assets/images/3.jpg";
import img4 from "../assets/images/4.jpg";
import img5 from "../assets/images/5.jpg";
import img6 from "../assets/images/6.jpg";
import img7 from "../assets/images/7.jpg";
import img8 from "../assets/images/8.jpg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

function Homepage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const perPage = 8;

  const {
    addToCart,
    increment,
    decrement,
    cartItems,
    notification,
    setBuyNowItem
  } = useCart();

  const navigate = useNavigate();

  const loadMore = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const start = (page - 1) * perPage;
      const end = page * perPage;
      const nextItemsRaw = productsData.slice(start, end);

      const nextItems = nextItemsRaw.map((p, i) => ({
        ...p,
        image: images[(start + i) % images.length],
      }));

      setProducts((prev) => [...prev, ...nextItems]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (products.length < productsData.length) {
          loadMore();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products, loading]);

  return (
    <div className="min-h-screen bg-[#0C0404] p-6 relative">
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {notification}
        </div>
      )}
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Sneakers Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const inCart = cartItems.find((item) => item.id === product.id);
          return (
            <div
              key={product.id}
              className="bg-[#B6B6B4] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover bg-white"
                loading="lazy"
              />
              <div className="h-[60px] p-4 flex justify-between">
                <h2 className="text-[110%] font-semibold mb-2">{product.title}</h2>
                <p className="bg-black px-5 text-gray-200 rounded-lg">${product.price}</p>
              </div>
              <div className="flex justify-between px-4 mb-3">
                {!addedIds.has(product.id) ? (
                  <button
                    className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
                    onClick={() => {
                      addToCart(product);
                      setAddedIds((prev) => new Set(prev).add(product.id));
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded px-2">
                      <button
                        className="px-2 text-lg cursor-pointer"
                        onClick={() => {
                          if (inCart?.quantity === 1) {
                            setAddedIds((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(product.id);
                              return newSet;
                            });
                          }
                          decrement(product.id);
                        }}
                      >
                        -
                      </button>
                      <span className="px-2">{inCart?.quantity || 1}</span>
                      <button className="px-2 text-lg cursor-pointer" onClick={() => increment(product.id)}>+</button>
                    </div>
                  </div>
                )}
                <button
                  className="bg-[#009900] text-white font-bold px-4 py-2 rounded hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setBuyNowItem({ ...product, quantity: inCart?.quantity || 1 });
                    navigate("/checkout");
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {loading && (
        <div className="mt-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
