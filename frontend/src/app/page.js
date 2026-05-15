"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);

// Purana localhost hata kar ye naya URL dalo
const API_URL = "";

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Backend offline!");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { name, price });
        setEditId(null);
      } else {
        await axios.post(API_URL, { name, price });
      }
      setName(''); setPrice('');
     fetchData();
    } catch (err) {
      alert("Action failed! Make sure backend is running.");
    }
  };

  const deleteProduct = async (id) => {
    if(confirm("Pakka delete karna hai?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    } 
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.price);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">ShopAdmin Panel</h1>
          <p className="text-gray-500">Manage your ecommerce products easily</p>
        </header>

        {/* Input Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            {editId ? '📝 Edit Product' : '➕ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
            <input 
              className="flex-1 min-w-[200px] border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="iPhone 15 Pro..." 
              required 
            />
            <input 
              className="w-32 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="Price ($)" 
              type="number"
              required 
            />
            <button 
              type="submit" 
              className={`px-6 py-2 rounded-lg font-bold text-white transition ${
                editId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {editId ? 'Update' : 'Save Product'}
            </button>
            {editId && (
              <button onClick={() => {setEditId(null); setName(''); setPrice('');}} className="text-gray-500 underline">Cancel</button>
            )}
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600">Product Name</th>
                <th className="p-4 font-bold text-gray-600">Price</th>
                <th className="p-4 font-bold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4 text-green-600 font-bold">${p.price}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => startEdit(p)} 
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteProduct(p.id)} 
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-400">No products found. Start adding some!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}