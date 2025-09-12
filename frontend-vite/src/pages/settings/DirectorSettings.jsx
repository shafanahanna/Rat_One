import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Building, 
  Users, 
  Settings, 
  DollarSign, 
  MapPin,
  TrendingUp,
  Shield,
  Database,
  Activity
} from 'lucide-react';
import CountriesBranches from './CountriesBranches';
import UserAssignment from './components/UserAssignment';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DirectorSettings = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    countries: 0,
    branches: 0,
    users: 0,
    currencies: []
  });
  const [loading, setLoading] = useState(true);

  // Load dashboard stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('Admintoken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const [countriesRes, branchesRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/countries`, { headers }),
        axios.get(`${API_URL}/api/branches`, { headers }),
        axios.get(`${API_URL}/api/api/users`, { headers })
      ]);
      
      const countries = countriesRes.data.data || [];
      const branches = branchesRes.data.data || [];
      const users = usersRes.data.data || [];
      
      const currencies = [...new Set(countries.map(c => c.transaction_currency))];
      
      setStats({
        countries: countries.length,
        branches: branches.length,
        users: users.length,
        currencies: currencies
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
      description: 'System overview and statistics'
    },
    {
      id: 'countries-branches',
      label: 'Countries & Branches',
      icon: Globe,
      description: 'Manage countries and branch locations'
    },
    {
      id: 'user-assignment',
      label: 'User Assignment',
      icon: Users,
      description: 'Assign users to branches and countries'
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Settings,
      description: 'Advanced system configuration'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Director Control Panel</h2>
        <p className="text-purple-100 mb-4">
          Manage your multi-country ERP operations from this centralized dashboard
        </p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{stats.countries} Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>{stats.branches} Branches</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{stats.users} Users</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{stats.currencies.length} Currencies</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.countries}</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Countries</h3>
          <p className="text-sm text-gray-600">Active operational regions</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.branches}</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Branches</h3>
          <p className="text-sm text-gray-600">Office locations worldwide</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.users}</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Active Users</h3>
          <p className="text-sm text-gray-600">Team members across branches</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.currencies.length}</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Currencies</h3>
          <p className="text-sm text-gray-600">Transaction currencies</p>
        </div>
      </div>

      {/* Currency Overview */}
      {stats.currencies.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            Active Currencies
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.currencies.map(currency => (
              <div key={currency} className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">{currency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('countries-branches')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
              <span className="font-medium text-gray-900">Add Country</span>
            </div>
            <p className="text-sm text-gray-600">Set up a new operational region</p>
          </button>

          <button
            onClick={() => setActiveTab('countries-branches')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <span className="font-medium text-gray-900">Add Branch</span>
            </div>
            <p className="text-sm text-gray-600">Create a new office location</p>
          </button>

          <button
            onClick={() => setActiveTab('user-assignment')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-600 group-hover:text-green-700" />
              <span className="font-medium text-gray-900">Assign Users</span>
            </div>
            <p className="text-sm text-gray-600">Move users between branches</p>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-600" />
          System Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-green-900">Database</p>
              <p className="text-sm text-green-700">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-green-900">Multi-Currency</p>
              <p className="text-sm text-green-700">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-green-900">User Context</p>
              <p className="text-sm text-green-700">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Database Configuration</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Advanced database settings and connection management
            </p>
            <button className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded transition-colors">
              Configure
            </button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Exchange Rates</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Configure currency exchange rates and update frequencies
            </p>
            <button className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition-colors">
              Manage Rates
            </button>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Security Settings</span>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              User permissions, role management, and security policies
            </p>
            <button className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded transition-colors">
              Security Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Director Settings</h1>
        <p className="text-gray-600">Centralized control panel for multi-country ERP operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'countries-branches' && <CountriesBranches />}
        {activeTab === 'user-assignment' && <UserAssignment />}
        {activeTab === 'system-settings' && renderSystemSettings()}
      </div>
    </div>
  );
};

export default DirectorSettings;
