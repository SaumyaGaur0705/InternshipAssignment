import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar';
import { Search, ArrowUpDown } from 'lucide-react';
import { Helmet } from "react-helmet";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of customers per page

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/get-user');
      const data = await response.json();
      if (data.success) {
        const mappedUsers = data.users.map(user => ({
          userId: user.userId || '',
          name: user.name || '',
          email: user.email || '',
          accountStatus: user.accountStatus || 'open'
        }));
        setCustomers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = React.useMemo(() => {
    if (!Array.isArray(customers)) return [];
    
    let sortableCustomers = [...customers];
    if (sortConfig.key !== null) {
      sortableCustomers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCustomers;
  }, [customers, sortConfig]);

  const filteredCustomers = sortedCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentPageCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <Helmet>
        <title>Customers | Admin | Mera Bestie</title>
      </Helmet>
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-pink-50 min-h-screen">
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
          <div className="relative">
            <div className="flex items-center w-full">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto mt-20">
          <table className="min-w-full table-auto">
            <thead className="bg-pink-100">
              <tr>
                {/* Table headers with sorting */}
                <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Account Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPageCustomers.map((customer) => (
                <tr key={customer.userId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${customer.accountStatus === 'closed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {customer.accountStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:bg-gray-300"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
