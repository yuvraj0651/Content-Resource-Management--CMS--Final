import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../Services/Tasks/TaskThunks";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const UpdateTaskModal = ({ onClose, editData, editingId }) => {

    const [formData, setFormData] = useState({
        title: editData.title || "",
        assignedTo: editData.assignedTo || "",
        priority: editData.priority || "Low",
        status: editData.status || "Pending",
        date: editData.date || "",
        description: editData.description || "",
    });

    const dispatch = useDispatch();
    const { updateLoading } = useSelector(state => state.tasks);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const updateTaskHandler = useCallback(() => {
        console.log("Editing ID:", editingId);

        dispatch(updateTask({
            id: editingId,
            updatedTask: formData,
        }))
            .unwrap()
            .then(() => {
                toast.success("Task Data Updated Successfully");
                setFormData({
                    title: "",
                    assignedTo: "",
                    priority: "Low",
                    status: "Pending",
                    date: "",
                    description: "",
                });
                onClose();
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            })
    }, [dispatch, formData, onClose, editingId]);

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="h-[32rem] overflow-y-auto bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Update Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {/* TITLE */}
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Task Title"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* ASSIGNED TO */}
                    <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        placeholder="Assigned To"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

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

                    {/* STATUS */}
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

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
                        placeholder="Task Description"
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
                        onClick={updateTaskHandler}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                        {updateLoading[editingId] ? "Updating Task..." : "Update Task"}
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default UpdateTaskModal;