import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeal } from "../../../Services/Deals/DealsThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const CreateDealModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        dealName: "",
        companyName: "",
        dealValue: "",
        stage: "all-stages",
        priority: "all-priorities",
        assignedTo: "",
        date: "",
        description: "",
    });

    const dispatch = useDispatch();
    const { addLoading } = useSelector((state) => state.deals);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const addDealsHandler = useCallback(() => {
        dispatch(createDeal(formData))
            .unwrap()
            .then(() => {
                toast.success("Deal Added To Deals List Successfully");
                setFormData({
                    dealName: "",
                    companyName: "",
                    dealValue: "",
                    stage: "all-stages",
                    priority: "all-priorities",
                    assignedTo: "",
                    date: "",
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
                    <h2 className="text-lg font-semibold">Create Deal</h2>
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
                        placeholder="Deal Name"
                        name="dealName"
                        value={formData.dealName}
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
                        placeholder="Deal Value (e.g. $3000)"
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
                        <option>Prospect</option>
                        <option>Negotiation</option>
                        <option>Won</option>
                        <option>Lost</option>
                    </select>

                    {/* PRIORITY */}
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option>Priority</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>

                    {/* ASSIGNED TO */}
                    <input
                        type="text"
                        placeholder="Assigned To"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* EXPECTED CLOSE DATE */}
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

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
                        onClick={addDealsHandler}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg">
                        {addLoading ? "Creating Deal..." : "Create Deal"}
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default CreateDealModal;