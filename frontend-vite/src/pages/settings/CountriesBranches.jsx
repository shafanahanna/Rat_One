import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Building, Globe, DollarSign, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCountries,
  addCountry,
  updateCountry,
  deleteCountry,
  addBranch,
  updateBranch,
  deleteBranch,
  setSearchTerm,
  toggleCountryExpansion,
  setSortConfig,
  clearError
} from '../../redux/slices/countriesBranchesSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const CountriesBranches = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const { countries, loading, error, expandedCountries, sortConfig, searchTerm } = useSelector(state => state.countriesBranches);
  
  // Local state
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  // Form states
  const [countryForm, setCountryForm] = useState({
    country_code: '',
    country_name: '',
    transaction_currency: '',
    currency_symbol: '',
    timezone: '',
  });

  const [branchForm, setBranchForm] = useState({
    country_id: '',
    branch_code: '',
    branch_name: '',
    city: '',
    state_province: '',
    is_headquarters: false
  });

  // Currency options
  const currencyOptions = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' }
  ];

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    console.log('Countries state updated:', countries);
    countries.forEach(country => {
      console.log(`Country: ${country.country_name}, ID: ${country.id}`);
      console.log(`Branches for ${country.country_name}:`, country.branches);
    });
  }, [countries]);

  useEffect(() => {
    console.log('Branches state updated:', countries);
  }, [countries]);

  const handleSaveCountry = async () => {
    try {
      if (editingCountry) {
        await dispatch(updateCountry({ id: editingCountry.id, ...countryForm }));
        alert('Country updated successfully!');
      } else {
        await dispatch(addCountry(countryForm));
        alert('Country created successfully!');
      }
      
      setShowCountryModal(false);
      setEditingCountry(null);
      setCountryForm({
        country_code: '',
        country_name: '',
        transaction_currency: '',
        currency_symbol: '',
        timezone: '',
      });
    } catch (error) {
      console.error('Error saving country:', error);
      alert('Error saving country');
    }
  };

  const handleEditCountry = (country) => {
    setEditingCountry(country);
    setCountryForm({
      country_code: country.country_code,
      country_name: country.country_name,
      transaction_currency: country.transaction_currency,
      currency_symbol: country.currency_symbol,
      timezone: country.timezone || '',
    });
    setShowCountryModal(true);
  };

  const handleDeleteCountry = async (countryId) => {
    if (window.confirm('Are you sure you want to delete this country? This will affect all associated branches and users.')) {
      try {
        await dispatch(deleteCountry(countryId));
        alert('Country deleted successfully!');
      } catch (error) {
        console.error('Error deleting country:', error);
        alert('Error deleting country');
      }
    }
  };

  const handleSaveBranch = async () => {
    try {
      if (editingBranch) {
        await dispatch(updateBranch({ id: editingBranch.id, ...branchForm }));
        alert('Branch updated successfully!');
      } else {
        await dispatch(addBranch(branchForm));
        alert('Branch created successfully!');
      }
      setShowBranchModal(false);
      setEditingBranch(null);
      setBranchForm({
        country_id: '',
        branch_code: '',
        branch_name: '',
        city: '',
        state_province: '',
        is_headquarters: false
      });
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Error saving branch');
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setBranchForm({
      country_id: branch.country_id,
      branch_code: branch.branch_code,
      branch_name: branch.branch_name,
      city: branch.city || '',
      state_province: branch.state_province || '',
      is_headquarters: branch.is_headquarters || false
    });
    setShowBranchModal(true);
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch? This will affect all associated users.')) {
      try {
        await dispatch(deleteBranch(branchId));
        alert('Branch deleted successfully!');
      } catch (error) {
        console.error('Error deleting branch:', error);
        alert('Error deleting branch');
      }
    }
  };

  const getBranchesForCountry = (countryId) => {
    const country = countries.find(country => country.id === countryId);
    console.log(`Getting branches for country ${countryId}:`, country);
    
    if (!country) {
      console.log(`Country ${countryId} not found`);
      return [];
    }
    
    if (!country.branches) {
      console.log(`No branches array for country ${country.country_name}`);
      return [];
    }
    
    console.log(`Found ${country.branches.length} branches for ${country.country_name}:`, country.branches);
    return country.branches || [];
  };

  const getUserCountForBranch = (branchId) => {
    // Find the country that contains this branch
    const country = countries.find(country => 
      country.branches && country.branches.some(b => b.id === branchId)
    );
    
    if (!country || !country.branches) return 0;
    
    // Find the branch and get its user_count
    const branch = country.branches.find(b => b.id === branchId);
    return branch && branch.user_count ? parseInt(branch.user_count, 10) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Countries & Branches</h1>
        <p className="text-gray-600">Manage your multi-country operations and branch structure</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCountryModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </button>
        <button
          onClick={() => setShowBranchModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      {/* Countries and Branches Display */}
      <div className="space-y-6">
        {countries.map(country => {
          const countryBranches = getBranchesForCountry(country.id);
          const totalUsers = countryBranches.reduce((sum, branch) => sum + getUserCountForBranch(branch.id), 0);
          
          return (
            <div key={country.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Country Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {country.country_name}
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {country.country_code}
                        </span>
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {country.transaction_currency} ({country.currency_symbol})
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {countryBranches.length} branches
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {totalUsers} users
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCountry(country)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCountry(country.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Branches */}
              <div className="p-6">
                {countryBranches.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {countryBranches.map(branch => (
                      <div key={branch.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <div>
                              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                {branch.branch_name}
                                {branch.is_headquarters && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    HQ
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">{branch.branch_code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditBranch(branch)}
                              className="p-1 text-gray-500 hover:text-purple-600 rounded"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteBranch(branch.id)}
                              className="p-1 text-gray-500 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {branch.city && <p>📍 {branch.city}, {branch.state_province}</p>}
                          <p className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {getUserCountForBranch(branch.id)} users
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No branches in this country yet</p>
                    <button
                      onClick={() => {
                        setBranchForm(prev => ({ ...prev, country_id: country.id }));
                        setShowBranchModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-700 text-sm mt-2"
                    >
                      Add first branch
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {countries.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No countries configured</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first country</p>
          <button
            onClick={() => setShowCountryModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Add Country
          </button>
        </div>
      )}

      {/* Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingCountry ? 'Edit Country' : 'Add New Country'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <input
                  type="text"
                  value={countryForm.country_code}
                  onChange={(e) => setCountryForm(prev => ({ ...prev, country_code: e.target.value.toUpperCase() }))}
                  placeholder="IN, AE, US"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Name
                </label>
                <input
                  type="text"
                  value={countryForm.country_name}
                  onChange={(e) => setCountryForm(prev => ({ ...prev, country_name: e.target.value }))}
                  placeholder="India, UAE, United States"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Currency
                </label>
                <select
                  value={countryForm.transaction_currency}
                  onChange={(e) => {
                    const selectedCurrency = currencyOptions.find(c => c.code === e.target.value);
                    setCountryForm(prev => ({
                      ...prev,
                      transaction_currency: e.target.value,
                      currency_symbol: selectedCurrency?.symbol || ''
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Currency</option>
                  {currencyOptions.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={countryForm.timezone}
                  onChange={(e) => setCountryForm(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="Asia/Kolkata, Asia/Dubai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveCountry}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
              >
                {editingCountry ? 'Update' : 'Create'} Country
              </button>
              <button
                onClick={() => {
                  setShowCountryModal(false);
                  setEditingCountry(null);
                  setCountryForm({
                    country_code: '',
                    country_name: '',
                    transaction_currency: '',
                    currency_symbol: '',
                    timezone: '',
                  });
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingBranch ? 'Edit Branch' : 'Add New Branch'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={branchForm.country_id}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, country_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.country_name} ({country.transaction_currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={branchForm.branch_code}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, branch_code: e.target.value.toUpperCase() }))}
                  placeholder="KOZ-HQ, DXB-MAIN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={branchForm.branch_name}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, branch_name: e.target.value }))}
                  placeholder="Kozhikode Headquarters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={branchForm.city}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Kozhikode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={branchForm.state_province}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, state_province: e.target.value }))}
                    placeholder="Kerala"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_headquarters"
                  checked={branchForm.is_headquarters}
                  onChange={(e) => setBranchForm(prev => ({ ...prev, is_headquarters: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_headquarters" className="ml-2 text-sm text-gray-700">
                  This is a headquarters branch
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveBranch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                {editingBranch ? 'Update' : 'Create'} Branch
              </button>
              <button
                onClick={() => {
                  setShowBranchModal(false);
                  setEditingBranch(null);
                  setBranchForm({
                    country_id: '',
                    branch_code: '',
                    branch_name: '',
                    city: '',
                    state_province: '',
                    is_headquarters: false
                  });
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountriesBranches;
