import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeProfile } from '../../../redux/slices/employeeSlice';
import {
  Calendar,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Phone,
  FileText,
  MapPin,
  Info,
  CheckCircle2,
  Check,
  Users,
} from "lucide-react";

const LeaveApplicationForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEmployee } = useSelector((state) => state.employees);

  // Form state
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    contactDetails: "",
    handoverNotes: "",
    availableForLeads: false,
  });

const API_URL = import.meta.env.VITE_API_URL;

  // Check if user is a Travel Consultant
  const [isTravelConsultant, setIsTravelConsultant] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Check user role when component mounts using Redux state
  useEffect(() => {
    // Fetch employee profile if not already in Redux state
    if (!currentEmployee) {
      dispatch(fetchEmployeeProfile());
    }
    
    if (currentEmployee && currentEmployee.role) {
      const roleFromRedux = currentEmployee.role;
      const roleLower = roleFromRedux.toLowerCase();
      setUserRole(roleFromRedux);

      const isTC =
        roleLower === "tc" ||
        roleLower === "travel consultant" ||
        roleLower === "travel_consultant" ||
        roleLower.includes("consultant");

      setIsTravelConsultant(isTC);
      console.log(
        "User role from Redux:",
        roleFromRedux,
        "isTravelConsultant:",
        isTC
      );
    }
  }, [currentEmployee, dispatch]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  // Fetch leave types when component mounts
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("Admintoken");
        // Get leave balances which include remaining days
        const balanceResponse = await axios.get(
          `${API_URL}/api/leave-management/leave-balances/employee/${currentEmployee?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(balanceResponse, "Balance summary response");

        if (balanceResponse.data && balanceResponse.data.data) {
          const leaveBalances = balanceResponse.data.data;
          console.log("Leave balances API response:", leaveBalances);
          
          // Extract unique leave types from the balances
          const uniqueLeaveTypes = [];
          const leaveTypeMap = {};
          
          leaveBalances.forEach(balance => {
            if (balance.leaveType && !leaveTypeMap[balance.leaveType.id]) {
              // Add leave type info and remaining days from balance
              const leaveTypeWithBalance = {
                ...balance.leaveType,
                remaining_days: balance.remaining_days,
                allocated_days: balance.allocated_days,
                used_days: balance.used_days,
                leave_type_id: balance.leave_type_id,
                color: balance.color || '#47BCCB'
              };
              uniqueLeaveTypes.push(leaveTypeWithBalance);
              leaveTypeMap[balance.leaveType.id] = true;
            }
          });
          
          console.log("Extracted leave types:", uniqueLeaveTypes);
          console.log("Leave types count:", uniqueLeaveTypes.length);
          
          if (uniqueLeaveTypes.length > 0) {
            setLeaveTypes(uniqueLeaveTypes);
            // Set default leave type if available
            setSelectedLeaveType(uniqueLeaveTypes[0]);
            setFormData((prev) => ({
              ...prev,
              leaveTypeId: uniqueLeaveTypes[0].id,
            }));
          } else {
            setError("No leave types found. Please contact HR.");
          }
        } else {
          setError("No leave balances found. Please contact HR.");
        }
      } catch (err) {
        console.error("Error fetching leave types:", err);
        setError("Failed to load leave types. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, [currentEmployee]);

  // Calculate total days between start and end date with timezone handling
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      // Create date objects at midnight in local timezone to avoid timezone issues
      const start = new Date(formData.startDate + "T00:00:00");
      const end = new Date(formData.endDate + "T00:00:00");

      // Ensure we're comparing dates in the same timezone
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

      setTotalDays(diffDays);
    } else {
      setTotalDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle leave type selection
  const handleLeaveTypeSelect = (type) => {
    console.log("Selected leave type:", type);
    setSelectedLeaveType(type);
    setFormData((prev) => ({
      ...prev,
      leaveTypeId: type.id,
    }));
    setShowLeaveTypeDropdown(false);
  };

  // Calculate number of days between start and end dates with timezone handling
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    // Create date objects at midnight in local timezone to avoid timezone issues
    const start = new Date(formData.startDate + "T00:00:00");
    const end = new Date(formData.endDate + "T00:00:00");

    // Ensure we're comparing dates in the same timezone
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Return 0 if end date is before start date
    if (end < start) return 0;

    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

    return diffDays;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.leaveTypeId) {
      setError("Please select a leave type");
      return;
    }

    if (!formData.startDate) {
      setError("Please select a start date");
      return;
    }

    if (!formData.endDate) {
      setError("Please select an end date");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please provide a reason for your leave");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token =
        localStorage.getItem("user-token") ||
        localStorage.getItem("Admintoken");
      const response = await axios.post(
        `${API_URL}/api/leave-management/leave-applications`,
        {
          leave_type_id: formData.leaveTypeId,
          start_date: formData.startDate,
          end_date: formData.endDate,
          reason: formData.reason,
          contact_details: formData.contactDetails,
          handover_notes: formData.handoverNotes,
          // available_for_leads field removed as it's not supported in the database
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Log the response for debugging
      console.log('Leave application submission response:', response.data);
      
      // Check if we have a response with data and no error message
      // The backend returns the created leave application object directly
      if (response.data && response.data.id) {
        setSuccess("Leave application submitted successfully!");
        // Reset form
        setFormData({
          leaveTypeId: "",
          startDate: "",
          endDate: "",
          reason: "",
          contactDetails: "",
          handoverNotes: "",
          availableForLeads: false,
        });

        // Call onSuccess callback after a short delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else if (response.data && response.data.status === "Success") {
        // For backward compatibility with older API format
        setSuccess("Leave application submitted successfully!");
        // Reset form
        setFormData({
          leaveTypeId: "",
          startDate: "",
          endDate: "",
          reason: "",
          contactDetails: "",
          handoverNotes: "",
          availableForLeads: false,
        });

        // Call onSuccess callback after a short delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError(
          response.data?.message ||
            "Failed to submit leave application. Please try again."
        );
      }
    } catch (err) {
      console.error("Error submitting leave application:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit leave application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden max-w-3xl mx-auto">
      {/* Form Header */}
      <div className="bg-[#F8F9FA] border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-[#5F6368] mr-3" />
          <h2 className="text-[#202124] text-lg font-medium">
            Leave Application
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {totalDays > 0 && (
            <div className="bg-[#E8F0FE] text-[#1967D2] text-sm py-1 px-3 rounded-full flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>
                {totalDays} day{totalDays !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {!loading && !submitting && success && (
        <div className="mx-6 mt-4 p-3 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E8E3E] rounded-md flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Error Message */}
      {!loading && !submitting && error && (
        <div className="mx-6 mt-4 p-3 bg-[#FCE8E6] border border-[#F4C7C3] text-[#D93025] rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#1A73E8] animate-spin mb-4" />
          <p className="text-[#5F6368]">Loading leave types...</p>
        </div>
      ) : error && leaveTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="w-10 h-10 text-[#D93025] mb-4" />
          <p className="text-[#5F6368] mb-4">Failed to load leave types</p>
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              const fetchLeaveTypes = async () => {
                try {
                  const token =
                    localStorage.getItem("user-token") ||
                    localStorage.getItem("Admintoken");
                  const balanceResponse = await axios.get(
                    `${API_URL}/api/leave/balance`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  if (balanceResponse.data && balanceResponse.data.data) {
                    setLeaveTypes(balanceResponse.data.data);
                    if (balanceResponse.data.data.length > 0) {
                      setSelectedLeaveType(balanceResponse.data.data[0]);
                      setFormData((prev) => ({
                        ...prev,
                        leaveTypeId: balanceResponse.data.data[0].leave_type_id,
                      }));
                    }
                  } else {
                    setError("No leave types found. Please contact HR.");
                  }
                } catch (err) {
                  console.error("Error fetching leave types:", err);
                  setError("Failed to load leave types. Please try again.");
                } finally {
                  setLoading(false);
                }
              };
              fetchLeaveTypes();
            }}
            className="py-2 px-4 bg-[#1A73E8] text-white rounded-md hover:bg-[#1967D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : submitting ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#1A73E8] animate-spin mb-4" />
          <p className="text-[#5F6368]">Submitting your leave application...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-8">
          {/* Leave Type Selection */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
            <div className="flex items-center px-4 py-3 bg-[#F8F9FA] border-b border-gray-200">
              <Calendar className="h-5 w-5 text-[#5F6368] mr-2" />
              <h3 className="text-[#202124] font-medium">Leave Details</h3>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <label
                  htmlFor="leaveTypeId"
                  className="block text-sm font-medium text-[#5F6368] mb-1"
                >
                  Leave Type <span className="text-[#D93025]">*</span>
                </label>
                <div className="relative">
                  <div
                    className="flex items-center justify-between w-full py-2 px-3 border border-gray-300 bg-white rounded-md cursor-pointer hover:border-[#1A73E8] transition-colors"
                    onClick={() =>
                      setShowLeaveTypeDropdown(!showLeaveTypeDropdown)
                    }
                  >
                    <div className="flex items-center">
                      {selectedLeaveType ? (
                        <span className="text-[#202124]">
                          {selectedLeaveType.name}
                          <span className="text-[#5F6368] text-sm ml-1">
                            {selectedLeaveType.remaining_days !== null &&
                            selectedLeaveType.remaining_days !== undefined
                              ? `(${selectedLeaveType.remaining_days} days remaining)`
                              : selectedLeaveType.max_days > 0
                              ? `(${selectedLeaveType.max_days} days allowed)`
                              : "(No limit)"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          Select a leave type
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>

                 {showLeaveTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 focus:outline-none sm:text-sm">
                      {console.log("Rendering dropdown with leaveTypes:", leaveTypes)}
                      {leaveTypes.map((type) => (
                        <div
                          key={type.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#F1F3F4] text-[#202124]"
                          onClick={() => handleLeaveTypeSelect(type)}
                        >
                          <div className="flex items-center">
                            <span className="font-normal block truncate">
                              {type.name}
                            </span>
                            <span className="text-[#5F6368] text-sm ml-2">
                              {type.remaining_days !== null &&
                              type.remaining_days !== undefined
                                ? `(${type.remaining_days} days remaining)`
                                : type.max_days > 0
                                ? `(${type.max_days} days allowed)`
                                : "(No limit)"}
                            </span>
                          </div>
                          {selectedLeaveType &&
                            selectedLeaveType.id === type.id && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <Check className="h-4 w-4 text-[#1A73E8]" />
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="hidden"
                    name="leaveTypeId"
                    id="leaveTypeId"
                    value={formData.leaveTypeId}
                    required
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-[#5F6368] mb-1"
                  >
                    Start Date <span className="text-[#D93025]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-[#5F6368]" />
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-colors"
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#5F6368]">
                    First day of leave
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-[#5F6368] mb-1"
                  >
                    End Date <span className="text-[#D93025]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-[#5F6368]" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-colors"
                      required
                      min={
                        formData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#5F6368]">
                    Last day of leave
                  </p>
                </div>
              </div>

              {/* Quick Duration Selection */}
              {formData.startDate && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-[#5F6368] mb-2">
                    Quick Duration
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const startDate = new Date(formData.startDate);
                        const endDate = new Date(startDate);
                        setFormData((prev) => ({
                          ...prev,
                          endDate: startDate.toISOString().split("T")[0], // Same day
                        }));
                      }}
                      className="py-1 px-3 bg-[#E8F0FE] text-[#1967D2] rounded-full text-sm hover:bg-[#D2E3FC] transition-colors"
                    >
                      1 Day
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startDate = new Date(formData.startDate);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 1);
                        setFormData((prev) => ({
                          ...prev,
                          endDate: endDate.toISOString().split("T")[0], // Next day
                        }));
                      }}
                      className="py-1 px-3 bg-[#E8F0FE] text-[#1967D2] rounded-full text-sm hover:bg-[#D2E3FC] transition-colors"
                    >
                      2 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startDate = new Date(formData.startDate);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 2);
                        setFormData((prev) => ({
                          ...prev,
                          endDate: endDate.toISOString().split("T")[0], // 3 days total
                        }));
                      }}
                      className="py-1 px-3 bg-[#E8F0FE] text-[#1967D2] rounded-full text-sm hover:bg-[#D2E3FC] transition-colors"
                    >
                      3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startDate = new Date(formData.startDate);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 4);
                        setFormData((prev) => ({
                          ...prev,
                          endDate: endDate.toISOString().split("T")[0], // 5 days (work week)
                        }));
                      }}
                      className="py-1 px-3 bg-[#E8F0FE] text-[#1967D2] rounded-full text-sm hover:bg-[#D2E3FC] transition-colors"
                    >
                      5 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startDate = new Date(formData.startDate);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 6);
                        setFormData((prev) => ({
                          ...prev,
                          endDate: endDate.toISOString().split("T")[0], // 7 days (full week)
                        }));
                      }}
                      className="py-1 px-3 bg-[#E8F0FE] text-[#1967D2] rounded-full text-sm hover:bg-[#D2E3FC] transition-colors"
                    >
                      1 Week
                    </button>
                  </div>
                </div>
              )}

              {/* Days Calculation */}
              {formData.startDate && formData.endDate && totalDays > 0 && (
                <div className="bg-[#F8F9FA] p-3 rounded-md border border-[#DADCE0] flex items-center">
                  <Clock className="h-5 w-5 text-[#1A73E8] mr-2" />
                  <p className="text-[#202124] text-sm">
                    <span className="font-medium">Duration:</span> {totalDays}{" "}
                    day{totalDays !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reason and Contact Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center px-4 py-3 bg-[#F8F9FA] border-b border-gray-200">
              <FileText className="h-5 w-5 text-[#5F6368] mr-2" />
              <h3 className="text-[#202124] font-medium">Leave Information</h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Reason */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-[#5F6368] mb-1"
                >
                  Reason for Leave <span className="text-[#D93025]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <FileText className="h-5 w-5 text-[#5F6368]" />
                  </div>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    value={formData.reason}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-colors"
                    placeholder="Please provide details about your leave request"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[#5F6368]">
                  Briefly explain the purpose of your leave
                </p>
              </div>

              {/* Contact Details */}
              <div>
                <label
                  htmlFor="contactDetails"
                  className="block text-sm font-medium text-[#5F6368] mb-1"
                >
                  Contact Details During Leave
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-[#5F6368]" />
                  </div>
                  <input
                    type="text"
                    id="contactDetails"
                    name="contactDetails"
                    value={formData.contactDetails}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-colors"
                    placeholder="Phone number or email where you can be reached if needed"
                  />
                </div>
                <p className="mt-1 text-xs text-[#5F6368]">
                  Optional: How to reach you during leave if needed
                </p>
              </div>
            </div>
          </div>

          {/* Handover Notes Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center px-4 py-3 bg-[#F8F9FA] border-b border-gray-200">
              <Users className="h-5 w-5 text-[#5F6368] mr-2" />
              <h3 className="text-[#202124] font-medium">
                Handover Information
              </h3>
            </div>

            <div className="p-4">
              <div>
                <label
                  htmlFor="handoverNotes"
                  className="block text-sm font-medium text-[#5F6368] mb-1"
                >
                  Handover Notes
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <Users className="h-5 w-5 text-[#5F6368]" />
                  </div>
                  <textarea
                    id="handoverNotes"
                    name="handoverNotes"
                    rows="3"
                    value={formData.handoverNotes}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-colors"
                    placeholder="Any important information for your team during your absence"
                  />
                </div>
                <p className="mt-1 text-xs text-[#5F6368]">
                  Optional: Tasks or responsibilities that need attention
                </p>
              </div>
            </div>
          </div>

          {/* Available for Leads - Only for Travel Consultants */}
          {isTravelConsultant && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center px-4 py-3 bg-[#F8F9FA] border-b border-gray-200">
                <MapPin className="h-5 w-5 text-[#5F6368] mr-2" />
                <h3 className="text-[#202124] font-medium">
                  Travel Consultant Options
                </h3>
              </div>

              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="availableForLeads"
                      name="availableForLeads"
                      type="checkbox"
                      checked={formData.availableForLeads}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          availableForLeads: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-[#1A73E8] focus:ring-[#1A73E8] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="availableForLeads"
                      className="font-medium text-[#202124]"
                    >
                      Available for Lead Assignments During Leave
                    </label>
                    <p className="text-[#5F6368] mt-1">
                      If checked, you will still receive new leads through the
                      round-robin assignment system during your leave period.
                      This is helpful if you want to monitor incoming leads
                      while away but still want them assigned to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-2">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#5F6368]">
                  * Required fields
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => onSuccess && onSuccess()}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#5F6368] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1A73E8] hover:bg-[#1967D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default LeaveApplicationForm;
