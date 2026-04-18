import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLead } from "../../../Services/Leads/LeadsThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const AddLeadModal = ({ onClose, editingId }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        dealValue: "",
        stage: "all-stages",
        leadSource: "all-leads",
        description: "",
    });

    const dispatch = useDispatch();
    const { addLoading } = useSelector((state) => state.leads);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const addLeadHandler = useCallback(() => {
        dispatch(createLead(formData))
            .unwrap()
            .then(() => {
                toast.success("Lead Added To The Leads List");
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    companyName: "",
                    dealValue: "",
                    stage: "all-stages",
                    leadSource: "all-leads",
                    description: "",
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
                    <h2 className="text-lg font-semibold">Add Lead</h2>
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
                        placeholder="Lead Name"
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

                    {/* DEAL VALUE */}
                    <input
                        type="text"
                        placeholder="Deal Value (e.g. $1000)"
                        name="dealValue"
                        value={formData.dealValue}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* STAGE */}
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option>Stage</option>
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Closed</option>
                    </select>

                    {/* SOURCE */}
                    <select
                        name="leadSource"
                        value={formData.leadSource}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option>Lead Source</option>
                        <option>Website</option>
                        <option>Referral</option>
                        <option>LinkedIn</option>
                        <option>Ads</option>
                        <option>Email Campaign</option>
                    </select>

                    {/* NOTES */}
                    <textarea
                        rows="3"
                        placeholder="Notes / Description"
                        name="description"
                        value={formData.description}
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
                        onClick={addLeadHandler}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        {addLoading[editingId] ? "Creating Lead..." : "Create Lead"}
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default AddLeadModal;