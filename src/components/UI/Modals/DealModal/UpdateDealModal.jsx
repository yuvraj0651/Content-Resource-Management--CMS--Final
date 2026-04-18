import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDeal } from "../../../Services/Deals/DealsThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const UpdateDealModal = ({ onClose, editData, editingId }) => {

    const [formData, setFormData] = useState({
        dealName: editData.dealName || "",
        companyName: editData.companyName || "",
        dealValue: editData.dealValue || "",
        stage: editData.stage || "Prospect",
        priority: editData.priority || "Low",
        assignedTo: editData.assignedTo || "",
        date: editData.date || "",
        description: editData.description || "",
    });

    const dispatch = useDispatch();
    const { updateLoading } = useSelector((state) => state.deals);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const updateDealHandler = useCallback(() => {
        dispatch(updateDeal({
            id: editingId,
            updatedDeal: formData,
        }))
            .unwrap()
            .then(() => {
                toast.success("Deal Updated Successfully");
                onClose();
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    }, [dispatch, editingId, formData, onClose]);

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="h-[32rem] overflow-y-auto bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Update Deal</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {/* DEAL NAME */}
                    <input
                        type="text"
                        name="dealName"
                        value={formData.dealName}
                        onChange={handleChange}
                        placeholder="Deal Name"
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

                    {/* VALUE */}
                    <input
                        type="text"
                        name="dealValue"
                        value={formData.dealValue}
                        onChange={handleChange}
                        placeholder="Deal Value"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* STAGE */}
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    >
                        <option value="Prospect">Prospect</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                    </select>

                    {/* PRIORITY */}
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    {/* ASSIGNED TO */}
                    <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        placeholder="Assigned To"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* DATE */}
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* DESCRIPTION */}
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Description"
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
                        onClick={updateDealHandler}
                        disabled={updateLoading[editingId]}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
                    >
                        {updateLoading[editingId] ? "Updating..." : "Update Deal"}
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default UpdateDealModal;