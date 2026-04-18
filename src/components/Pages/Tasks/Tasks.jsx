import { useCallback, useEffect, useMemo, useState } from "react";
import CreateTaskModal from "../../UI/Modals/AddTask/AddTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { bulkDeleteTasks, deleteTask, fetchAllTasks, updateTaskStatus } from "../../Services/Tasks/TaskThunks";
import UpdateTaskModal from "../../UI/Modals/AddTask/UpdateTaskModal";
import toast from "react-hot-toast";
import TableSkeleton from "../../UI/TableSkeleton/TableSkeleton";

const Tasks = () => {

    const [selected, setSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllTasks());
    }, [dispatch]);

    const toggleAddTaskModal = useCallback(() => {
        setIsAddTaskModalOpen((prev) => !prev);
    }, []);

    const toggleUpdateTaskModal = useCallback(() => {
        setIsUpdateModalOpen((prev) => !prev);
    }, []);

    const { tasksData = [],
        fetchLoading,
        statusLoading,
        bulkLoading,
    } = useSelector((state) => state.tasks);

    const toggleSelect = useCallback((id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const saveEdit = useCallback((task) => {
        setEditingId(task.id);
        setEditData(task);
    }, []);

    const deleteTaskHandler = useCallback((id) => {
        dispatch(deleteTask(id))
            .unwrap()
            .then(() => {
                toast.success("Task Deleted Successfully");
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    }, [dispatch]);

    const updateTaskStatusHandler = useCallback((id, newTask) => {
        dispatch(updateTaskStatus({
            id,
            updatedTaskStatus: newTask,
        }))
    }, [dispatch]);

    const bulkTaskHandler = useCallback(() => {
        if (selected.length === 0) return;

        dispatch(bulkDeleteTasks(selected))
            .unwrap()
            .then(() => toast.success("Tasks Deleted"))
            .catch((err) => toast.error(err));

        setSelected([]);
    }, [dispatch, selected]);

    // Pagination
    const itemsPerPage = 6;

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const paginatedTasks = useMemo(() => {
        return tasksData.slice(firstItemIndex, lastItemIndex);
    }, [tasksData, firstItemIndex, lastItemIndex]);

    const totalPages = Math.ceil(tasksData.length / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>

                <button
                    disabled={fetchLoading}
                    onClick={toggleAddTaskModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    + Add Task
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">

                <table className="w-full text-left">

                    <thead className="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th className="p-3">
                                <input
                                    type="checkbox"
                                    checked={selected.length === tasksData.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelected(tasksData.map((task) => task.id));
                                        } else {
                                            setSelected([]);
                                        }
                                    }}
                                /></th>
                            <th className="p-3">Task</th>
                            <th className="p-3">Assigned To</th>
                            <th className="p-3">Priority</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">

                        {fetchLoading ? (
                            <TableSkeleton rows={6} />
                        ) :
                            paginatedTasks?.length === 0 ? (
                                <tr className="col-span-full">
                                    <td colSpan={7} className="text-center py-6">
                                        <p>no tasks data found...</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTasks?.map((task) => (
                                    <tr key={task.id} className="border-t hover:bg-gray-50">

                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(task.id)}
                                                onChange={() => toggleSelect(task.id)}
                                            />
                                        </td>

                                        <td className="p-3 font-medium">{task.title}</td>
                                        <td className="p-3 text-gray-600">{task.assignedTo}</td>

                                        {/* PRIORITY */}
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-sm uppercase ${task.priority === "High"
                                                    ? "bg-red-100 text-red-600"
                                                    : task.priority === "Medium"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>

                                        {/* STATUS DROPDOWN */}
                                        <td className="p-3">
                                            <select
                                                disabled={statusLoading[task.id]}
                                                value={task.status}
                                                onChange={(e) =>
                                                    updateTaskStatusHandler(task.id, e.target.value)
                                                }
                                                className={`px-2 py-1 rounded-lg text-sm border`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>

                                        {/* DUE DATE */}
                                        <td className="p-3 text-gray-600">
                                            {task.date}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => {
                                                    toggleUpdateTaskModal();
                                                    saveEdit(task);
                                                }}
                                                className="text-blue-500 hover:underline">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteTaskHandler(task.id)}
                                                className="text-red-500 hover:underline">
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}

                    </tbody>

                </table>

            </div>

            {/* BULK ACTION */}
            {selected.length > 0 && (
                <div className="bg-white border p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <span>{selected.length} selected</span>

                    <button
                        onClick={bulkTaskHandler}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg">
                        {bulkLoading ? "Deleting Selected..." : "Delete Selected"}
                    </button>
                </div>
            )}

            {/* PAGINATION */}
            <div className="flex justify-between items-center text-sm text-gray-600">

                <span>Showing {firstItemIndex + 1}–{Math.min(lastItemIndex, tasksData.length)} of {tasksData.length} tasks</span>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border rounded-lg">Prev</button>
                    {
                        pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : ""}`}>
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
                isAddTaskModalOpen && (
                    <div>
                        <CreateTaskModal onClose={toggleAddTaskModal} />
                    </div>
                )
            }
            {
                isUpdateModalOpen && editingId !== null && (
                    <div>
                        <UpdateTaskModal
                            onClose={toggleUpdateTaskModal}
                            editData={editData}
                            editingId={editingId}
                        />
                    </div>
                )
            }
        </div>
    );
};

export default Tasks;