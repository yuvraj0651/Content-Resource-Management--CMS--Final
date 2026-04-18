import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../../Services/Users/UsersThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const EditUserModal = ({ onClose, editData, editingId }) => {
    const [formData, setFormData] = useState({
        fullName: editData.fullName || "",
        email: editData.email || "",
        role: editData.role || "select-role",
        status: editData.status || "select-status",
        techRole: editData.techRole || "",
    });

    const dispatch = useDispatch();
    const { updateLoading } = useSelector((state) => state.users);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const updateUserHandler = useCallback(() => {
        dispatch(updateUser({
            id: editingId,
            updatedUser: formData
        }))
            .unwrap()
            .then(() => {
                toast.success("User Updated Successfully");
                setFormData({
                    fullName: "",
                    email: "",
                    role: "select-role",
                    status: "select-status",
                    techRole: "",
                });
                console.log("editingId:", editingId);
                onClose();
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            })
    }, [dispatch, editingId, formData, onClose]);

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Edit User</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* ROLE */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                    </select>

                    {/* STATUS */}
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* TECHNICAL ROLE */}
                    <select
                        name="techRole"
                        value={formData.techRole}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
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

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={updateLoading[editingId]}
                        onClick={updateUserHandler}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg">
                        {updateLoading[editingId] ? "Updating User" : "Update User"}
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default EditUserModal;