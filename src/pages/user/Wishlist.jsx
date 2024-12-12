import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    // Fetch details for each product in the wishlist
    const fetchWishlistItems = async () => {
      try {
        const productPromises = wishlist.map(async (productId) => {
          const response = await fetch(
            `https://ecommercebackend-8gx8.onrender.com/product/${productId}`
          );
          const data = await response.json();
          if (data.success) {
            return data.product;
          }
          return null;
        });

        const products = await Promise.all(productPromises);
        setWishlistItems(products.filter((product) => product !== null));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch wishlist items");
        setLoading(false);
      }
    };

    if (wishlist.length > 0) {
      fetchWishlistItems();
    } else {
      setLoading(false);
    }
  }, [wishlist]);

  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(updatedWishlist);
    setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <h2 className="text-2xl text-gray-600">
          {error || "Your wishlist is empty."}
        </h2>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wishlist | Mera Bestie</title>
      </Helmet>
      <Navbar />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white shadow-md p-4 rounded-md">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
              <p className="text-lg font-semibold text-pink-600">
                Rs. {item.price}
              </p>
              <div className="flex justify-between items-center mt-4">
              <button onClick={() => navigate(`/${item._id}`)} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
               View Product</button>

                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
