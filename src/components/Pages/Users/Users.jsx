import { useCallback, useEffect, useMemo, useState } from "react";
import AddUserModal from "../../UI/Modals//UserModals/AddUser/AddUserModal";
import EditUserModal from "../../UI/Modals//UserModals/EditUser/EditUserModal";
import { useDispatch, useSelector } from "react-redux";
import { bulkDeleteUsers, deleteUser, fetchAllUsers, updateUser, updateUserRole, updateUserStatus } from "../../Services/Users/UsersThunk";
import useDebounce from "../../Hooks/useDebounce";
import toast from "react-hot-toast";
import TableSkeleton from "../../UI/TableSkeleton/TableSkeleton";

const Users = () => {
  const [selected, setSelected] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all-role");
  const [selectedStatus, setSelectedStatus] = useState("all-status");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedRole, selectedStatus]);

  const toggleAddModal = useCallback(() => {
    setIsAddModalOpen((prev) => !prev);
  }, []);

  const toggleEditModal = useCallback(() => {
    setIsEditModalOpen((prev) => !prev);
  }, []);

  const { usersData = [],
    statusLoading,
    fetchLoading,
    deleteLoading,
    roleLoading,
    bulkLoading,
    updateLoading,
  } = useSelector((state) => state.users);

  const updateStatusHandler = useCallback((id, newStatus) => {
    dispatch(updateUserStatus({ id, updatedStatus: newStatus }));
  }, [dispatch]);

  const updateRoleHandler = useCallback((id, newRole) => {
    dispatch(updateUserRole({ id, updatedRole: newRole }));
  }, [dispatch]);

  const toggleSelect = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const saveEdit = useCallback((user) => {
    setEditingId(user.id);
    setEditData(user);
  }, []);

  const deleteUserHandler = useCallback((id) => {
    if (!window.confirm("Are you sure?")) return;

    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        toast.success("User Deleted Successfully");
      })
      .catch((error) => {
        toast.error(error || "Something went wrong");
      });
  }, [dispatch]);

  const updateTechRoleHandler = useCallback((id, value) => {
    dispatch(updateUser({
      id,
      updatedUser: { techRole: value },
    }));
  }, [dispatch]);

  const bulkDeleteHandler = useCallback(() => {
    if (selected.length === 0) return;

    dispatch(bulkDeleteUsers(selected));

    setSelected([]);
  },[dispatch, selected]);

  const filteredUsers = useMemo(() => {
    let filteredData = [...usersData];

    if (debouncedSearch.trim()) {
      filteredData = filteredData.filter((item) =>
        item.fullName?.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
      );
    };

    if (selectedStatus !== "all-status") {
      filteredData = filteredData.filter((item) =>
        item.status === selectedStatus
      );
    };

    if (selectedRole !== "all-role") {
      filteredData = filteredData.filter((item) =>
        item.role === selectedRole
      );
    };

    return filteredData;
  }, [debouncedSearch, usersData, selectedRole, selectedStatus]);

  // Pagination
  const itemsPerPage = 6;

  const lastItemIndex = itemsPerPage * currentPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(firstItemIndex, lastItemIndex)
  }, [filteredUsers, firstItemIndex, lastItemIndex]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>

        <button
          onClick={toggleAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          + Add User
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full md:w-80 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border px-3 py-2 rounded-lg">
            <option value="all-role">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
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
                  checked={selected.length === paginatedUsers.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(paginatedUsers.map(u => u.id));
                    } else {
                      setSelected([]);
                    }
                  }}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Technical Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {fetchLoading ? (
              <TableSkeleton rows={6} />
            ) :
              paginatedUsers?.length === 0 ? (
                <tr className="col-span-full">
                  <td colSpan={7} className="text-center py-7">
                    <p>no users data matched your search or sort</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers?.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">

                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>

                    <td className="p-3 font-medium">{user.fullName}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>

                    <td className="p-3">
                      <select
                        disabled={roleLoading[user.id]}
                        value={user.role}
                        onChange={(e) => {
                          updateRoleHandler(user.id, e.target.value)
                        }}
                        className="border px-2 py-1 rounded-lg text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <select
                        disabled={statusLoading[user.id]}
                        value={user.status}
                        onChange={(e) => {
                          updateStatusHandler(user.id, e.target.value);
                        }}
                        className={`px-2 py-1 rounded-lg text-sm border`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <select
                        name="techRole"
                        value={user.techRole || "tech-role"}
                        onChange={(e) => updateTechRoleHandler(user.id, e.target.value)}
                        className="w-full border px-3 py-2 text-sm rounded-lg">
                        <option value="tech-role">Technical Role</option>
                        <option value="frontend">Frontend Developer</option>
                        <option value="backend">Backend Developer</option>
                        <option value="full-stack">Full Stack Developer</option>
                        <option value="react">React Developer</option>
                        <option value="node">Node.js Developer</option>
                        <option value="devops">DevOps Engineer</option>
                        <option value="qa">QA Tester</option>
                        <option value="ui-ux">UI/UX Designer</option>
                        <option value="mobile">Mobile App Developer</option>
                        <option value="analysis">Data Analyst</option>
                        <option value="ai-ml">AI/ML Engineer</option>
                        <option value="engineer">Software Engineer</option>
                      </select>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => {
                          toggleEditModal();
                          saveEdit(user);
                          setEditingId(user.id);
                        }}
                        className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUserHandler(user.id)}
                        className="text-red-500 hover:underline">
                        {deleteLoading[user.id] ? "Deleting..." : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))
              )}
          </tbody>

        </table>

      </div>

      {/* BULK ACTION BAR */}
      {selected.length > 0 && (
        <div className="bg-white border p-3 rounded-lg shadow-sm flex justify-between items-center">
          <span>{selected.length} selected</span>

          <button
            onClick={bulkDeleteHandler}
            className="bg-red-500 text-white px-4 py-2 rounded-lg">
            {bulkLoading ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm text-gray-600">

        <span>Showing {firstItemIndex + 1} - {Math.min(lastItemIndex, filteredUsers.length)} of {filteredUsers.length} users</span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-lg">Prev</button>
          {
            pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : ""
                  }`}>
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
        isAddModalOpen && (
          <div>
            <AddUserModal onClose={toggleAddModal} />
          </div>
        )
      }
      {
        isEditModalOpen && editingId !== null && (
          <div>
            <EditUserModal
              onClose={toggleEditModal}
              editData={editData}
              editingId={editingId}
            />
          </div>
        )
      }
    </div>
  );
};

export default Users;