import React, { useState, useEffect } from 'react';
import { Users, MapPin, Building, Search, Filter, Edit2, Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsersWithContext,
  fetchAssignmentStats,
  updateUserBranch,
  bulkUpdateUserBranch,
  toggleUserSelection,
  selectAllUsers,
  clearSelectedUsers,
  setBulkEditMode
} from '../../../redux/slices/usersSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const UserAssignment = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error, 
    selectedUsers, 
    bulkEditMode: reduxBulkEditMode,
    assignmentStats 
  } = useSelector(state => state.users);
  const { countries } = useSelector(state => state.countriesBranches);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load data
  useEffect(() => {
    dispatch(fetchUsersWithContext());
    dispatch(fetchAssignmentStats());
  }, [dispatch]);

  // Handle user branch update
  const handleUpdateUserBranch = (userId, branchId) => {
    dispatch(updateUserBranch({ userId, branchId }))
      .unwrap()
      .then(() => {
        alert('User branch updated successfully!');
        setEditingUser(null);
      })
      .catch(error => {
        alert('Error updating user branch');
      });
  };

  // Handle bulk update
  const handleBulkUpdate = (branchId) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to update');
      return;
    }

    dispatch(bulkUpdateUserBranch({ userIds: selectedUsers, branchId }))
      .unwrap()
      .then(() => {
        alert(`${selectedUsers.length} users updated successfully!`);
      })
      .catch(error => {
        alert('Error updating users');
      });
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !filterCountry || user.country_id === filterCountry;
    const matchesBranch = !filterBranch || user.branch_id === filterBranch;
    const matchesUnassigned = !showUnassignedOnly || !user.branch_id;
    
    return matchesSearch && matchesCountry && matchesBranch && matchesUnassigned;
  });

  // Get branches for a specific country
  const getBranchesForCountry = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.branches || [] : [];
  };

  // Get all branches from all countries
  const getAllBranches = () => {
    return countries.flatMap(country => country.branches || []);
  };

  // Get country info for a user
  const getCountryInfo = (countryId) => {
    return countries.find(c => c.id === countryId);
  };

  // Get branch info for a user
  const getBranchInfo = (branchId) => {
    for (const country of countries) {
      const branch = (country.branches || []).find(b => b.id === branchId);
      if (branch) return branch;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Assignment</h1>
        <p className="text-gray-600">Assign users to countries and branches</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
            </div>

            {/* Country Filter */}
            <select
              value={filterCountry}
              onChange={(e) => {
                setFilterCountry(e.target.value);
                setFilterBranch(''); // Reset branch filter when country changes
                setShowUnassignedOnly(false); // Reset unassigned filter when country changes
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.country_name}
                </option>
              ))}
            </select>

            {/* Branch Filter */}
            <select
              value={filterBranch}
              onChange={(e) => {
                setFilterBranch(e.target.value);
                setShowUnassignedOnly(false); // Reset unassigned filter when branch changes
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {(filterCountry ? getBranchesForCountry(filterCountry) : getAllBranches()).map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name} ({branch.branch_code})
                </option>
              ))}
            </select>
            
            
          </div>

          {/* Bulk Edit Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {filteredUsers.length} users found
            </span>
            <button
              onClick={() => {
                dispatch(setBulkEditMode(!reduxBulkEditMode));
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                reduxBulkEditMode 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {reduxBulkEditMode ? 'Cancel Bulk Edit' : 'Bulk Edit'}
            </button>
          </div>
        </div>

        {/* Bulk Edit Controls */}
        {reduxBulkEditMode && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700">
                {selectedUsers.length} users selected
              </span>
              <div className="flex items-center gap-3">
                <select
                  onChange={(e) => e.target.value && handleBulkUpdate(e.target.value)}
                  className="px-3 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Move selected users to...</option>
                  {getAllBranches().map(branch => {
                    const country = getCountryInfo(branch.country_id);
                    return (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name} ({country?.country_name})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {reduxBulkEditMode && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          dispatch(selectAllUsers());
                        } else {
                          dispatch(clearSelectedUsers());
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => {
                const country = getCountryInfo(user.country_id);
                const branch = getBranchInfo(user.branch_id);
                const isEditing = editingUser === user.id;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {reduxBulkEditMode && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => {
                            dispatch(toggleUserSelection(user.id));
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          defaultValue={user.branch_id}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                          onChange={(e) => {
                            handleUpdateUserBranch(user.id, e.target.value);
                          }}
                        >
                          <option value="">No Branch Assigned</option>
                          {getAllBranches().map(branch => {
                            const branchCountry = getCountryInfo(branch.country_id);
                            return (
                              <option key={branch.id} value={branch.id}>
                                {branch.branch_name} ({branchCountry?.country_name})
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <div>
                          {branch ? (
                            <div>
                              <div className="flex items-center text-sm font-medium text-gray-900">
                                <Building className="w-4 h-4 mr-2 text-gray-500" />
                                {branch.branch_name}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="w-4 h-4 mr-2" />
                                {country?.country_name}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {branch.branch_code}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-red-600">No branch assigned</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {country ? (
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{country.currency_symbol}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {country.transaction_currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {!reduxBulkEditMode && (
                        <button
                          onClick={() => setEditingUser(isEditing ? null : user.id)}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                        >
                          {isEditing ? (
                            <>
                              <X className="w-4 h-4" />
                              Cancel
                            </>
                          ) : (
                            <>
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {countries.map(country => {
          // Find stats for this country from the assignment stats
          const countryStats = assignmentStats.assignments
            .filter(stat => stat.country_name === country.country_name)
            .reduce((total, stat) => total + parseInt(stat.user_count || 0), 0);
          
          const countryBranches = getBranchesForCountry(country.id);
          
          return (
            <div key={country.id} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{country.country_name}</h3>
                <span className="text-2xl">{country.currency_symbol}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span className="font-medium">{countryStats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Branches:</span>
                  <span className="font-medium">{countryBranches.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-medium">{country.transaction_currency}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        
      </div>
    </div>
  );
};

export default UserAssignment;
