import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../../Services/Tasks/TaskThunks";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const CreateTaskModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        assignedTo: "",
        priority: "all-priorities",
        status: "all-status",
        date: "",
        description: "",
    });

    const dispatch = useDispatch();
    const { addLoading } = useSelector((state) => state.tasks);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const addTaskHandler = useCallback(() => {
        dispatch(createTask(formData))
            .unwrap()
            .then(() => {
                toast.success("New Task Added Successfully");
                setFormData({
                    title: "",
                    assignedTo: "",
                    priority: "all-priorities",
                    status: "all-status",
                    date: "",
                    description: "",
                });
                onClose();
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            })
    }, [dispatch, formData, onClose]);

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="h-[30rem] overflow-y-auto bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {/* TASK TITLE */}
                    <input
                        type="text"
                        placeholder="Task Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* ASSIGNED TO */}
                    <input
                        type="text"
                        placeholder="Assigned To"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    />

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

                    {/* STATUS */}
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg">
                        <option>Status</option>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>

                    {/* DUE DATE */}
                    <input
                        type="date"
                        className="w-full border px-3 py-2 rounded-lg"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    {/* DESCRIPTION */}
                    <textarea
                        rows="3"
                        placeholder="Task Description"
                        className="w-full border px-3 py-2 rounded-lg"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
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
                        disabled={addLoading}
                        onClick={addTaskHandler}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        {addLoading ? "Creating Task..." : "Create Task"}
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default CreateTaskModal;