import { useCallback, useEffect, useMemo, useState } from "react";
import CreateDealModal from "../../UI/Modals/DealModal/CreateDealModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteDeal, fetchAllDeals, updateDeal } from "../../Services/Deals/DealsThunk";
import UpdateDealModal from "../../UI/Modals/DealModal/UpdateDealModal";
import ViewDealModal from "../../UI/Modals/DealModal/ViewDealModal";
import toast from "react-hot-toast";
import PipelineSkeleton from "../../UI/PipeLineSkleleton/PipelineSkeleton";

const Deals = () => {
    const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
    const [isUpdateDealModalOpen, setIsUpdateDealModalOpen] = useState(false);
    const [isViewDealModalOpen, setIsViewDealModelOpen] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedOver, setDraggedOver] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllDeals());
    }, [dispatch]);

    const { dealsData = [],
        deleteLoading,
        fetchLoading,
    } = useSelector((state) => state.deals);

    const stages = ["Prospect", "Negotiation", "Won", "Lost"];

    const toggleCreateDealModal = useCallback(() => {
        setIsCreateDealModalOpen((prev) => !prev);
    }, []);

    const toggleUpdateDealModal = useCallback(() => {
        setIsUpdateDealModalOpen((prev) => !prev);
    }, []);

    const toggleViewDealModal = useCallback(() => {
        setIsViewDealModelOpen((prev) => !prev);
    }, []);

    const saveEdit = useCallback((deal) => {
        setEditingId(deal.id);
        setEditData(deal);
    }, []);

    const handleView = useCallback((deal) => {
        setViewData(deal);
    }, []);

    const droppedItemHandler = useCallback((newStage) => {
        if (!draggedItem) return;

        if (draggedItem.stage === newStage) return;

        dispatch(updateDeal({
            id: draggedItem.id,
            updatedDeal: { stage: newStage },
        }))
            .unwrap()
            .then(() => {
                toast.success(`Moved to ${newStage}`);
            })
            .catch((err) => {
                toast.error(err || "Failed to move lead");
            });
        setDraggedItem(null);
        setDraggedOver(null);
    }, [dispatch, draggedItem]);

    const groupedDeals = useMemo(() => {
        return stages?.map(stage => ({
            stage,
            items: dealsData?.filter(deal => deal.stage === stage)
        }))
    }, [dealsData]);

    const deleteDealHandler = useCallback((id) => {
        dispatch(deleteDeal(id))
            .unwrap()
            .then(() => {
                toast.success("Deal Data Deleted Successfully");
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    }, [dispatch]);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Deals Pipeline</h1>

                <button
                    disabled={fetchLoading}
                    onClick={toggleCreateDealModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    + Create Deal
                </button>
            </div>

            {/* PIPELINE */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {fetchLoading ? (
                    <PipelineSkeleton />
                ) :
                    dealsData?.length === 0 ? (
                        <div className="col-span-full text-center py-10 bg-white rounded-xl border">
                            <p className="text-gray-500">No deals found to display...</p>
                        </div>
                    ) : (
                        groupedDeals?.map((column) => (
                            <div
                                key={column.stage}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDraggedOver(column.stage)
                                }}
                                onDrop={() => droppedItemHandler(column.stage)}
                                onDragLeave={() => setDraggedOver(null)}
                                className={`rounded-xl p-3 transition 
                                        ${draggedOver === column.stage
                                        ? "bg-blue-50 border border-blue-400"
                                        : "bg-gray-50"
                                    }`}>

                                {/* COLUMN HEADER */}
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-semibold text-gray-700">
                                        {column.stage}
                                    </h2>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                        {column.items.length}
                                    </span>
                                </div>

                                {/* DEAL CARDS */}
                                <div className="space-y-3">

                                    {column.items.map((deal) => (
                                        <div
                                            key={deal.id}
                                            draggable
                                            onDragStart={() => setDraggedItem(deal)}
                                            onDragEnd={() => setDraggedItem(null)}
                                            className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition"
                                        >

                                            {/* TITLE */}
                                            <h3 className="font-medium text-gray-800">
                                                {deal.dealName}
                                            </h3>

                                            {/* COMPANY */}
                                            <p className="text-sm text-gray-500">
                                                {deal.companyName}
                                            </p>

                                            {/* VALUE + PRIORITY */}
                                            <div className="flex justify-between items-center mt-2">

                                                <span className="text-sm font-bold text-green-600">
                                                    {deal.value}
                                                </span>

                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${deal.priority === "High"
                                                        ? "bg-red-100 text-red-600"
                                                        : deal.priority === "Medium"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-gray-200 text-gray-600"
                                                        }`}
                                                >
                                                    {deal.priority}
                                                </span>

                                            </div>

                                            {/* ACTION */}
                                            <div className="flex justify-end mt-2 gap-2">
                                                <button
                                                    disabled={deleteLoading[deal.id]}
                                                    onClick={() => {
                                                        toggleUpdateDealModal();
                                                        saveEdit(deal);
                                                    }}
                                                    className="text-xs text-amber-500 hover:text-amber-600 hover:underline">
                                                    Edit
                                                </button>
                                                <button
                                                    disabled={deleteLoading[deal.id]}
                                                    onClick={() => deleteDealHandler(deal.id)}
                                                    className="text-xs text-red-500 hover:text-red-600 hover:underline">
                                                    {deleteLoading[deal.id] ? "Deleting Deal..." : "Delete"}
                                                </button>
                                                <button
                                                    disabled={deleteLoading[deal.id]}
                                                    onClick={() => {
                                                        toggleViewDealModal();
                                                        handleView(deal);
                                                    }}
                                                    className="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">
                                                    View
                                                </button>
                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </div>
                        ))
                    )}

            </div>
            {
                isCreateDealModalOpen && (
                    <div>
                        <CreateDealModal onClose={toggleCreateDealModal} />
                    </div>
                )
            }
            {
                isUpdateDealModalOpen && editingId !== null && (
                    <div>
                        <UpdateDealModal
                            onClose={toggleUpdateDealModal}
                            editData={editData}
                            editingId={editingId}
                        />
                    </div>
                )
            }
            {
                isViewDealModalOpen && (
                    <div>
                        <ViewDealModal
                            onClose={toggleViewDealModal}
                            deal={viewData}
                        />
                    </div>
                )
            }
        </div>
    );
};

export default Deals;