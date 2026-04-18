import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "../../../Services/Leads/LeadsThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const EditLeadModal = ({ onClose, editData, editingId }) => {

    const [formData, setFormData] = useState({
        fullName: editData.fullName || "",
        email: editData.email || "",
        phone: editData.phone || "",
        companyName: editData.companyName || "",
        dealValue: editData.dealValue || "",
        stage: editData.stage || "all-stages",
        leadSource: editData.leadSource || "all-leads",
        description: editData.description || "",
    });

    const dispatch = useDispatch();
    const { updateLoading } = useSelector((state) => state.leads);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const updateLeadHandler = useCallback(() => {
        dispatch(updateLead({
            id: editingId,
            updatedLead: formData,
        }))
            .unwrap()
            .then(() => {
                toast.success("Lead Data Updated Successfully");
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
    }, [dispatch, editingId, formData, onClose]);

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            {/* MODAL CONTAINER */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Edit Lead
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-lg">
                        ✕
                    </button>
                </div>

                {/* BODY (SCROLLABLE) */}
                <div className="p-4 space-y-4 overflow-y-auto">

                    {/* NAME */}
                    <div>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* COMPANY */}
                    <div>
                        <label className="text-sm text-gray-600">Company</label>
                        <input
                            type="text"
                            placeholder="Enter company name"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* DEAL VALUE */}
                    <div>
                        <label className="text-sm text-gray-600">Deal Value</label>
                        <input
                            type="text"
                            placeholder="e.g. $2000"
                            name="dealValue"
                            value={formData.dealValue}
                            onChange={handleChange}
                            className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* STAGE + SOURCE (RESPONSIVE GRID) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm text-gray-600">Stage</label>
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                                className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Qualified</option>
                                <option>Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Lead Source</label>
                            <select
                                name="leadSource"
                                value={formData.leadSource}
                                onChange={handleChange}
                                className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Website</option>
                                <option>Referral</option>
                                <option>LinkedIn</option>
                                <option>Ads</option>
                                <option>Email Campaign</option>
                            </select>
                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm text-gray-600">Notes / Description</label>
                        <textarea
                            rows="3"
                            placeholder="Write notes..."
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full mt-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex flex-col sm:flex-row justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Cancel
                    </button>

                    <button
                        onClick={updateLeadHandler}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        {updateLoading[editingId] ? "Updating lead..." : "Update Lead"}
                    </button>

                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default EditLeadModal;