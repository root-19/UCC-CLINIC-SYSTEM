import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import bgClinic from '../../assets/images/bg-clinic.png';
import { env } from '../../config/env';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expirationDate: Date | string;
  unit: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const Inventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reduceQuantityId, setReduceQuantityId] = useState<string | null>(null);
  const [reduceAmount, setReduceAmount] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    expirationDate: '',
    unit: 'pcs',
  });

  // Categories for dropdown
  const categories = [
    'Medications',
    'Medical Supplies',
    'Equipment',
    'Consumables',
    'First Aid',
    'Other',
  ];

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API_URL}/api/inventory`);
      const data = await response.json();

      if (data.success) {
        setInventoryItems(data.data);
      } else {
        setError(data.message || 'Failed to fetch inventory');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${env.API_URL}/api/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowAddForm(false);
        setFormData({
          name: '',
          category: '',
          quantity: '',
          expirationDate: '',
          unit: 'pcs',
        });
        fetchInventory();
      } else {
        alert(data.message || 'Failed to add inventory item');
      }
    } catch (err) {
      console.error('Error adding inventory item:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleReduceQuantity = async (itemId: string) => {
    if (!reduceAmount || Number(reduceAmount) <= 0) {
      alert('Please enter a valid quantity to reduce');
      return;
    }

    try {
      setUpdatingId(itemId);
      const response = await fetch(`${env.API_URL}/api/inventory/${itemId}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: Number(reduceAmount) }),
      });

      const data = await response.json();

      if (data.success) {
        setReduceQuantityId(null);
        setReduceAmount('');
        fetchInventory();
      } else {
        alert(data.message || 'Failed to reduce quantity');
      }
    } catch (err) {
      console.error('Error reducing quantity:', err);
      alert('Network error. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${env.API_URL}/api/inventory/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchInventory();
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Network error. Please try again.');
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpiringSoon = (expirationDate: Date | string) => {
    if (!expirationDate) return false;
    const dateObj = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
    const today = new Date();
    const diffTime = dateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0; // Expiring within 30 days
  };

  const isExpired = (expirationDate: Date | string) => {
    if (!expirationDate) return false;
    const dateObj = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
    return dateObj < new Date();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <AdminTopBar onMenuClick={toggleSidebar} />

        {/* Content with Background */}
        <main className="flex-1 relative overflow-auto">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${bgClinic})` }}
          />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clinic Inventory</h1>
                <div className="flex gap-2">
                  <button
                    onClick={fetchInventory}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover transition-colors text-sm sm:text-base"
                  >
                    {showAddForm ? 'Cancel' : 'Add Item'}
                  </button>
                </div>
              </div>

              {/* Add Item Form */}
              {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Inventory Item</h2>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="e.g., Paracetamol 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="e.g., pcs, boxes, bottles"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date *
                      </label>
                      <input
                        type="date"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover transition-colors font-medium"
                      >
                        Add Item
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
                  <p className="mt-4 text-gray-600">Loading inventory...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {!loading && !error && inventoryItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No inventory items found.</p>
                  <p className="text-gray-500 text-sm mt-2">Click "Add Item" to start adding inventory.</p>
                </div>
              )}

              {!loading && !error && inventoryItems.length > 0 && (
                <div className="overflow-x-auto">
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-4">
                    {inventoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.category}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isExpired(item.expirationDate)
                              ? 'bg-red-100 text-red-800'
                              : isExpiringSoon(item.expirationDate)
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isExpired(item.expirationDate)
                              ? 'Expired'
                              : isExpiringSoon(item.expirationDate)
                              ? 'Expiring Soon'
                              : 'Active'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <p>
                            <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                          </p>
                          <p>
                            <span className="font-medium">Expiration Date:</span>{' '}
                            <span className={isExpired(item.expirationDate) ? 'text-red-600 font-semibold' : ''}>
                              {formatDate(item.expirationDate)}
                            </span>
                          </p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {reduceQuantityId === item.id ? (
                            <div className="flex-1 flex gap-2">
                              <input
                                type="number"
                                value={reduceAmount}
                                onChange={(e) => setReduceAmount(e.target.value)}
                                placeholder="Qty"
                                min="1"
                                max={item.quantity}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <button
                                onClick={() => handleReduceQuantity(item.id)}
                                disabled={updatingId === item.id}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400"
                              >
                                {updatingId === item.id ? '...' : 'Reduce'}
                              </button>
                              <button
                                onClick={() => {
                                  setReduceQuantityId(null);
                                  setReduceAmount('');
                                }}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setReduceQuantityId(item.id);
                                  setReduceAmount('');
                                }}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Reduce
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <table className="hidden sm:table w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Item Name
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Expiration Date
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium">
                            {item.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {item.category}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {item.quantity} {item.unit}
                          </td>
                          <td className={`border border-gray-300 px-4 py-3 text-sm ${
                            isExpired(item.expirationDate) ? 'text-red-600 font-semibold' : 'text-gray-700'
                          }`}>
                            {formatDate(item.expirationDate)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isExpired(item.expirationDate)
                                ? 'bg-red-100 text-red-800'
                                : isExpiringSoon(item.expirationDate)
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {isExpired(item.expirationDate)
                                ? 'Expired'
                                : isExpiringSoon(item.expirationDate)
                                ? 'Expiring Soon'
                                : 'Active'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {reduceQuantityId === item.id ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="number"
                                  value={reduceAmount}
                                  onChange={(e) => setReduceAmount(e.target.value)}
                                  placeholder="Qty"
                                  min="1"
                                  max={item.quantity}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <button
                                  onClick={() => handleReduceQuantity(item.id)}
                                  disabled={updatingId === item.id}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium disabled:bg-gray-400"
                                >
                                  {updatingId === item.id ? '...' : 'Reduce'}
                                </button>
                                <button
                                  onClick={() => {
                                    setReduceQuantityId(null);
                                    setReduceAmount('');
                                  }}
                                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setReduceQuantityId(item.id);
                                    setReduceAmount('');
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                                  title="Reduce Quantity"
                                >
                                  Reduce
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium"
                                  title="Delete Item"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && inventoryItems.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Total Items: <span className="font-semibold">{inventoryItems.length}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;

