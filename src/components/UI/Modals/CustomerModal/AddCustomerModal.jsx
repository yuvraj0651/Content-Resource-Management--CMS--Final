import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AddCustomer } from "../../../Services/Customers/CustomersThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const AddCustomerModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        companyName: "",
        phone: "",
        type: "all-types",
        status: "all-status",
        address: ""
    });

    const dispatch = useDispatch();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const addCustomersHandler = useCallback(() => {
        const CustomerWithDate = {
            ...formData,
            createdAt: new Date().toISOString(),
        };
        dispatch(AddCustomer(CustomerWithDate))
            .unwrap()
            .then(() => {
                toast.success("New Customer Added To Customers Lists");
                setFormData({
                    fullName: "",
                    email: "",
                    companyName: "",
                    phone: "",
                    type: "all-types",
                    status: "all-status",
                    address: ""
                });
                onClose();
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    }, [dispatch, formData, onClose]);

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="h-[30rem] overflow-y-auto bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Add Customer</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {/* NAME */}
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* EMAIL */}
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* PHONE */}
                    <input
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* COMPANY */}
                    <input
                        type="text"
                        placeholder="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* TYPE */}
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option value="all-types">Customer Type</option>
                        <option value="premium">Premium</option>
                        <option value="regular">Regular</option>
                    </select>

                    {/* STATUS */}
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option value="all-status">Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* ADDRESS */}
                    <textarea
                        rows="3"
                        placeholder="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    ></textarea>

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
                        onClick={addCustomersHandler}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Create Customer
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default AddCustomerModal;