//updated code
import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import AddEmployeeForm from "../components/ui/AddEmployeeForm";
import UpdateEmployeeForm from "../components/ui/UpdateEmployeeForm";
import BulkUpload from "../components/ui/BulkUpload.jsx";
import {
  Search,
  UserPlus,
  Filter,
  FileText,
  ArrowUpDown,
  X,
} from "lucide-react";
import { employeeService } from "../api/services/employee.service.js";
import { toast } from "../components/ui/sonner.jsx";
import EmployeeTable from "../components/ui/EmployeeTable.jsx";
import TableSkeleton from "../components/ui/TableSkeleton.jsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { designationService } from "../api/services/designation.service.js";
import { departmentService } from "../api/services/department.service.js";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const recordsPerPage = 10;
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  // --- Filter & sort state ---
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchEmployees().then(() => {});
    fetchDesignations().then(() => {});
    fetchDepartments().then(() => {});
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      toast.error("Error fetching departments");
      throw err;
    }
  };

  const bulkRegister = async (bulkEmployees) => {
    try {
      await employeeService.bulkAdd(bulkEmployees);
      fetchEmployees().then(() => {});
    } catch (err) {
      toast.error("Error adding employees");
      throw err;
    } finally {
      setShowBulkUpload(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      const data = await designationService.getDesignations();
      setDesignations(data);
    } catch (err) {
      toast.error("Error fetching designations");
      throw err;
    }
  };
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (e) {
      toast.error("Error fetching employees");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (emp) => {
    setSelectedEmp(emp);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await employeeService.deleteOne(selectedEmp.id);
      fetchEmployees().then(() => {});
      toast.success("Employee deleted successfully");
    } catch (e) {
      toast.error("Error deleting employee");
      throw e;
    } finally {
      setShowConfirm(false);
      setSelectedEmp(null);
    }
  };

  const onAddEmployeeClick = () => {
    setIsAddDialogOpen(true);
  };

  const onEditEmployeeClick = (emp) => {
    setSelectedEmp(emp);
    setIsEditDialogOpen(true);
  };

  // --- Search ---
  const searchedEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      (emp.username ?? "").toLowerCase().includes(term) ||
      (emp.email ?? "").toLowerCase().includes(term) ||
      (emp.phone_number ?? "").toLowerCase().includes(term) ||
      (emp.designation?.designation_name ?? "").toLowerCase().includes(term) ||
      (emp.department?.department_name ?? "").toLowerCase().includes(term)
    );
  });

  // --- Filter (department / designation / status) ---
  const filteredByOptions = searchedEmployees.filter((emp) => {
    const matchesDept =
      !filterDepartment ||
      String(emp.department_id ?? emp.department?.id) ===
        String(filterDepartment);
    const matchesDesig =
      !filterDesignation ||
      String(emp.designation_id ?? emp.designation?.id) ===
        String(filterDesignation);
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "Active" ? !!emp.is_enrolled : !emp.is_enrolled);
    return matchesDept && matchesDesig && matchesStatus;
  });

  // --- Sort ---
  const filteredEmployees = [...filteredByOptions].sort((a, b) => {
    if (!sortBy) return 0;

    let valA = "";
    let valB = "";

    if (sortBy === "name") {
      valA = (a.username ?? "").toLowerCase();
      valB = (b.username ?? "").toLowerCase();
    } else if (sortBy === "department") {
      valA = (a.department?.department_name ?? "").toLowerCase();
      valB = (b.department?.department_name ?? "").toLowerCase();
    } else if (sortBy === "designation") {
      valA = (a.designation?.designation_name ?? "").toLowerCase();
      valB = (b.designation?.designation_name ?? "").toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const activeFilterCount =
    (filterDepartment ? 1 : 0) +
    (filterDesignation ? 1 : 0) +
    (filterStatus ? 1 : 0) +
    (sortBy ? 1 : 0);

  const clearFilters = () => {
    setFilterDepartment("");
    setFilterDesignation("");
    setFilterStatus("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const [showExportOptions, setShowExportOptions] = useState(false);

  const exportCSV = (data) => {
    const csv = Papa.unparse(
      data.map(
        ({ username, email, phone_number, department, designation }) => ({
          "Employee Name": username,
          Email: email,
          Phone: phone_number,
          Designation: designation?.designation_name || "N/A",
          Circle: department?.department_name || "N/A",
        }),
      ),
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "employees.csv");
  };

  const exportPDF = (data) => {
    const doc = new jsPDF();

    doc.text("Employee List", 14, 15);

    const tableData = data.map((emp) => [
      emp.username,
      emp.email,
      emp.phone_number,
      emp.designation?.designation_name || "N/A",
      emp.department?.department_name || "N/A",
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Employee Name", "Email", "Phone", "Designation", "Department"]],
      body: tableData,
    });

    doc.save("employees.pdf");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center w-full sm:w-auto">
            Employee Management
          </h1>
          <div className="flex flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={onAddEmployeeClick}
              className="flex items-center justify-center gap-2 bg-instattend-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded shadow hover:bg-instattend-700 text-sm sm:text-base"
            >
              <UserPlus className="h-4 w-4" />
              <span className="whitespace-nowrap">Add New Employee</span>
            </button>
            <button
              onClick={() => setShowBulkUpload(true)}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded shadow hover:bg-green-700 text-sm sm:text-base"
            >
              <FileText className="h-4 w-4" />
              <span className="whitespace-nowrap">Bulk Upload</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
          <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-instattend-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-center sm:justify-end">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setShowFilterOptions(!showFilterOptions)}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm sm:text-base ${
                  activeFilterCount > 0
                    ? "border-instattend-500 bg-instattend-50 text-instattend-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden xs:inline">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="bg-instattend-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilterOptions && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-20 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Filter & Sort
                    </h3>
                    <button onClick={() => setShowFilterOptions(false)}>
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Department
                    </label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => {
                        setFilterDepartment(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-instattend-500"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Designation
                    </label>
                    <select
                      value={filterDesignation}
                      onChange={(e) => {
                        setFilterDesignation(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-instattend-500"
                    >
                      <option value="">All Designations</option>
                      {designations.map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.designation_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-instattend-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="border-t pt-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-instattend-500"
                    >
                      <option value="">None</option>
                      <option value="name">Name</option>
                      <option value="department">Department</option>
                      <option value="designation">Designation</option>
                    </select>

                    {sortBy && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortOrder("asc")}
                          className={`flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-md border ${
                            sortOrder === "asc"
                              ? "bg-instattend-600 text-white border-instattend-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ArrowUpDown className="h-3 w-3" /> Ascending
                        </button>
                        <button
                          onClick={() => setSortOrder("desc")}
                          className={`flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-md border ${
                            sortOrder === "desc"
                              ? "bg-instattend-600 text-white border-instattend-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ArrowUpDown className="h-3 w-3" /> Descending
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full text-center text-sm text-instattend-600 hover:text-instattend-800 font-medium pt-1"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            <div className="relative inline-block text-left">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm sm:text-base"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden xs:inline">Export</span>
              </button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                  <button
                    onClick={() => {
                      exportCSV(filteredEmployees);
                      setShowExportOptions(false);
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportPDF(filteredEmployees);
                      setShowExportOptions(false);
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <TableSkeleton />
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No employees found matching the current filters
            </div>
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={onEditEmployeeClick}
              onDelete={handleDelete}
              currentPage={currentPage}
              recordsPerPage={recordsPerPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>

        {/* Modals */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <strong>{selectedEmp?.username}</strong>?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm sm:text-base"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-xl p-4 sm:p-6 relative">
              <AddEmployeeForm
                onClose={() => setIsAddDialogOpen(false)}
                departments={departments}
                designation={designations}
                onAdd={(newEmp) => {
                  setEmployees([...employees, newEmp]);
                  setIsAddDialogOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {isEditDialogOpen && selectedEmp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-xl p-4 sm:p-6 relative">
              <UpdateEmployeeForm
                selectedEmployee={selectedEmp}
                onClose={() => {
                  setIsEditDialogOpen(false);
                  setSelectedEmp(null);
                }}
                departments={departments}
                designation={designations}
                onUpdate={(updatedEmp) => {
                  setEmployees((prev) =>
                    prev.map((emp) =>
                      emp.email === updatedEmp.email ? updatedEmp : emp,
                    ),
                  );
                  setIsEditDialogOpen(false);
                  setSelectedEmp(null);
                }}
              />
            </div>
          </div>
        )}

        {showBulkUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-xl p-4 sm:p-6 relative">
              <BulkUpload
                onUpload={bulkRegister}
                onClose={() => setShowBulkUpload(false)}
              />
              <button
                onClick={() => setShowBulkUpload(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Employees;
