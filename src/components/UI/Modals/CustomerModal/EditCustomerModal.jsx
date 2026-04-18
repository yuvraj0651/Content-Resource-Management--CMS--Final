import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCustomer } from "../../../Services/Customers/CustomersThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const EditCustomerModal = ({ onClose, editData, editingId }) => {

    const [formData, setFormData] = useState({
        fullName: editData.fullName || "",
        email: editData.email || "",
        phone: editData.phone || "",
        companyName: editData.companyName || "",
        type: editData.type || "select-type",
        status: editData.status || "select-status",
        address: editData.address || ""
    });

    const dispatch = useDispatch();
    const { updateLoading } = useSelector((state) => state.customers);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const updateCustomerHandler = useCallback(() => {
        dispatch(updateCustomer({
            id: editingId,
            updatedCustomer: formData
        }))
            .unwrap()
            .then(() => {
                toast.success("Customer Data Updated Successfully");
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    companyName: "",
                    type: "select-type",
                    status: "select-status",
                    address: ""
                });
                onClose();
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    }, [dispatch, editingId, formData, onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">

            {/* MODAL */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg md:text-xl font-semibold">
                        Edit Customer
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="p-4 overflow-y-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* FULL NAME */}
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full border px-3 py-2 rounded-lg"
                        />

                        {/* EMAIL */}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border px-3 py-2 rounded-lg"
                        />

                        {/* PHONE */}
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full border px-3 py-2 rounded-lg"
                        />

                        {/* COMPANY */}
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Company Name"
                            className="w-full border px-3 py-2 rounded-lg"
                        />

                        {/* TYPE */}
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="select-type">Customer Type</option>
                            <option value="premium">Premium</option>
                            <option value="regular">Regular</option>
                        </select>

                        {/* STATUS */}
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="select-status">Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                    </div>

                    {/* ADDRESS (full width) */}
                    <div className="mt-4">
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Address"
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => updateCustomerHandler()}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg w-full sm:w-auto"
                    >
                        {updateLoading[editingId] ? "Updating Customer..." : "Update Customer"}
                    </button>

                </div>

            </div>
        </div>,
        document.getElementById("modal-root")
    );
};

export default EditCustomerModal;