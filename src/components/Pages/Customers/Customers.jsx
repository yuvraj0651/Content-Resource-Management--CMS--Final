import { useCallback, useEffect, useMemo, useState } from "react";
import AddCustomerModal from "../../UI/Modals/CustomerModal/AddCustomerModal";
import { useDispatch, useSelector } from "react-redux";
import { bulkDeleteCustomers, deleteCustomer, fetchAllCustomers, updateCustomerStatus, updateCustomerType } from "../../Services/Customers/CustomersThunk";
import useDebounce from "../../Hooks/useDebounce";
import EditCustomerModal from "../../UI/Modals/CustomerModal/EditCustomerModal";
import toast from "react-hot-toast";
import TableSkeleton from "../../UI/TableSkeleton/TableSkeleton";

const Customers = () => {
  const [selected, setSelected] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all-types");
  const [selectedStatus, setSelectedStatus] = useState("all-status");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedType, selectedStatus]);

  const { customersData = [],
    statusLoading,
    fetchLoading,
    typeLoading,
    bulkLoading,
    deleteLoading
  } = useSelector((state) => state.customers);

  const toggleCustomerModal = useCallback(() => {
    setIsCustomerModalOpen((prev) => !prev);
  }, []);

  const toggleEditCustomerModal = useCallback(() => {
    setIsEditCustomerModalOpen((prev) => !prev);
  }, []);

  const saveEdit = useCallback((customer) => {
    setEditingId(customer.id);
    setEditData(customer);
  }, []);

  const deleteCustomerHandler = useCallback((id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    dispatch(deleteCustomer(id))
      .unwrap()
      .then(() => {
        toast.success("Customer Deleted Successfully");
      })
      .catch((error) => {
        toast.error(error || "Something went wrong");
      })
  }, [dispatch]);

  // Filtering
  const filteredCustomers = useMemo(() => {
    let filteredData = [...customersData];

    if (debouncedSearch.trim()) {
      filteredData = filteredData.filter((item) =>
        item.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    };

    if (selectedType !== "all-types") {
      filteredData = filteredData.filter((item) =>
        item.type === selectedType
      );
    };

    if (selectedStatus !== "all-status") {
      filteredData = filteredData.filter((item) =>
        item.status === selectedStatus
      );
    };

    return filteredData;
  }, [debouncedSearch, selectedStatus, selectedType, customersData]);

  // Pagination
  const itemsPerPage = 6;
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice(firstItemIndex, lastItemIndex);
  }, [filteredCustomers, firstItemIndex, lastItemIndex]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  };

  const toggleSelect = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const updateCustomerTypeHandler = useCallback((id, newType) => {
    dispatch(updateCustomerType({ customerId: id, updatedType: newType }));
  }, [dispatch]);

  const updateCustomerStatusHandler = useCallback((id, newStatus) => {
    dispatch(updateCustomerStatus({ customerId: id, updatedStatus: newStatus }));
  }, [dispatch]);

  const bulkDeleteHandler = useCallback(() => {
    if (selected.length === 0) return;

    dispatch(bulkDeleteCustomers(selected))
      .unwrap()
      .then(() => {
        toast.success(`${selected.length} customers deleted`);
        setSelected([]);
      })
      .catch((error) => {
        toast.error(error || "Failed to delete");
      });
  }, [dispatch] , selected);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>

        <button
          onClick={toggleCustomerModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          + Add Customer
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

        {/* Search */}
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border px-3 py-2 rounded-lg">
            <option value="all-types">All Types</option>
            <option value="premium">Premium</option>
            <option value="regular">Regular</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border px-3 py-2 rounded-lg">
            <option value="all-status">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    paginatedCustomers.length > 0 &&
                    selected.length === paginatedCustomers.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(paginatedCustomers.map((customer) => customer.id));
                    } else {
                      setSelected([]);
                    }
                  }}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">

            {fetchLoading ? (
              <TableSkeleton rows={6} />
            ) :
              paginatedCustomers?.length === 0 ? (
                <tr className="col-span-full">
                  <td colSpan={7} className="text-center py-6">
                    <p>no customers found...</p>
                  </td>
                </tr>
              ) : (
                paginatedCustomers?.map((cust) => (
                  <tr key={cust.id} className="border-t hover:bg-gray-50">

                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(cust.id)}
                        onChange={() => toggleSelect(cust.id)}
                      />
                    </td>

                    <td className="p-3 font-medium">{cust.fullName}</td>
                    <td className="p-3 text-gray-600">{cust.email}</td>
                    <td className="p-3 text-gray-600">{cust.phone}</td>

                    {/* TYPE DROPDOWN */}
                    <td className="p-3">
                      <select
                        disabled={typeLoading[cust.id]}
                        value={cust.type}
                        onChange={(e) => {
                          updateCustomerTypeHandler(cust.id, e.target.value)
                        }}
                        className="border px-2 py-1 rounded-lg text-sm"
                      >
                        <option value="premium">Premium</option>
                        <option value="regular">Regular</option>
                      </select>
                    </td>

                    {/* STATUS DROPDOWN */}
                    <td className="p-3">
                      <select
                        disabled={statusLoading[cust.id]}
                        value={cust.status}
                        onChange={(e) =>
                          updateCustomerStatusHandler(cust.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-lg text-sm border ${cust.status === "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                          }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => {
                          saveEdit(cust);
                          toggleEditCustomerModal();
                        }}
                        className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomerHandler(cust.id)}
                        className="text-red-500 hover:underline">
                        {deleteLoading[cust.id] ? "Deleting..." : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))
              )}
          </tbody>

        </table>

      </div>

      {/* BULK ACTION */}
      {selected.length > 0 && (
        <div className="bg-white border p-3 rounded-lg shadow-sm flex justify-between items-center">
          <span>{selected.length} selected</span>

          <button
            onClick={bulkDeleteHandler}
            className="bg-red-500 text-white px-4 py-2 rounded-lg">
            {bulkLoading ? "Deleting Selected..." : "Delete Selected"}
          </button>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm text-gray-600">

        <span>Showing {firstItemIndex + 1}–{Math.min(lastItemIndex, filteredCustomers.length)} of {filteredCustomers.length} customers</span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-lg">Prev</button>
          {
            pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : ""}`}>
                {page}
              </button>
            ))
          }
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded-lg">Next</button>
        </div>

      </div>
      {
        isCustomerModalOpen && (
          <div>
            <AddCustomerModal onClose={toggleCustomerModal} />
          </div>
        )
      }
      {
        isEditCustomerModalOpen && editingId !== null && (
          <div>
            <EditCustomerModal
              onClose={toggleEditCustomerModal}
              editData={editData}
              editingId={editingId}
            />
          </div>
        )
      }
    </div>
  );
};

export default Customers;