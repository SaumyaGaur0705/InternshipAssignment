import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import Navbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/footer';

const Shop = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loadMore, setLoadMore] = useState(6);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedProducts')) || [];
    setLikedProducts(storedLikes);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/get-product');
        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(product =>
            product.name &&
            product.price &&
            product.img &&
            product.category &&
            product._id &&
            product.visibility === "on"
          );
          setProducts(validProducts);
          setSortedProducts(validProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const toggleLike = (productId) => {
    const updatedLikes = likedProducts.includes(productId)
      ? likedProducts.filter((id) => id !== productId)
      : [...likedProducts, productId];

    setLikedProducts(updatedLikes);
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
  };

  return (
    <>
      <Helmet>
        <title>Shop | Mera Bestie</title>
      </Helmet>
      <div className="bg-pink-100">
        <Navbar />
        <section className="bg-cover bg-center py-16 text-center" style={{ backgroundImage: "url('src/assets/bg shop.png')" }}>
          <h2 className="text-5xl font-bold text-black">SHOP BY CATEGORY</h2>
          <p className="text-gray-800 mt-12 text-lg">
            Discover our exclusive collections tailored just for you.
          </p>
        </section>

        <div className="max-w-7xl mx-auto p-6">
          <h3 className="text-3xl font-bold mb-4">Products</h3>
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
            {(filteredProducts.length > 0 ? filteredProducts : sortedProducts)
              .slice(0, loadMore)
              .map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/${product._id}`}>
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url('${product.img}')` }}
                    />
                  </Link>
                  <div className="p-4 text-center">
                    
                    <p className="text-gray-600">{product.price}</p>
                    <div className="mt-2">
                      <span className="text-yellow-500">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span className="text-gray-300">{'★'.repeat(5 - Math.floor(product.rating))}</span>
                      <span className="text-gray-600 ml-2">{product.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
          <div className="text-center mt-10 pb-20">
            {loadMore < sortedProducts.length ? (
              <button className="bg-black text-white px-6 py-2 rounded-md" onClick={() => setLoadMore(loadMore + 6)}>
                Load More
              </button>
            ) : (
              <button className="bg-black text-white px-6 py-2 rounded-md" onClick={() => setLoadMore(6)}>
                Show Less
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
