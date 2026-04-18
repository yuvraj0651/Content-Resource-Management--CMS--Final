import { useCallback, useEffect, useMemo, useState } from "react";
import AddLeadModal from "../../UI/Modals/LeadModal/AddLeadModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteLead, fetchAllLeads, updateLead } from "../../Services/Leads/LeadsThunk";
import EditLeadModal from "../../UI/Modals/LeadModal/EditLeadModal";
import ViewLeadModal from "../../UI/Modals/LeadModal/ViewLeadModal";
import toast from "react-hot-toast";
import PipelineSkeleton from "../../UI/PipeLineSkleleton/PipelineSkeleton";

const Leads = () => {
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
    const [isViewLeadOpen, setIsViewLeadOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [draggedLead, setDraggedLead] = useState(null);
    const [dragOverStage, setDragOverStage] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllLeads());
    }, [dispatch]);

    const { leadsData = [],
        fetchLoading,
        deleteLoading,
    } = useSelector((state) => state.leads);

    const stages = ["New", "Contacted", "Qualified", "Closed"];

    const groupedLeads = useMemo(() => {
        return stages.map(stage => ({
            stage,
            items: leadsData.filter(lead => lead.stage === stage)
        }))
    }, [leadsData]);

    const toggleAddLeadModal = useCallback(() => {
        setIsAddLeadModalOpen((prev) => !prev);
    }, []);

    const toggleEditLeadModal = useCallback(() => {
        setIsEditLeadModalOpen((prev) => !prev);
    }, []);

    const saveEdit = useCallback((lead) => {
        setEditingId(lead.id);
        setEditData(lead);
    }, []);

    const toggleViewLeadModal = useCallback(() => {
        setIsViewLeadOpen((prev) => !prev);
    }, []);
    
    const handleView = useCallback((lead) => {
        setSelectedLead(lead);
        setIsViewLeadOpen(true);
    }, []);


    const handleDrop = useCallback((newStage) => {
        if (!draggedLead) return;

        if (draggedLead.stage === newStage) return;

        dispatch(updateLead({
            id: draggedLead.id,
            updatedLead: { stage: newStage }
        }))
            .unwrap()
            .then(() => {
                toast.success(`Moved to ${newStage}`);
            })
            .catch((err) => {
                toast.error(err || "Failed to move lead");
            });

        setDraggedLead(null);
    }, [dispatch , draggedLead]);

    const deleteLeadHandler = useCallback((id) => {
        dispatch(deleteLead(id))
            .unwrap()
            .then(() => {
                toast.success("Lead Deleted Successfully");
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            })
    }, [dispatch]);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Leads Pipeline</h1>

                <button
                    disabled={fetchLoading}
                    onClick={toggleAddLeadModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    + Add Lead
                </button>
            </div>

            {/* PIPELINE */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {fetchLoading ? (
                    <PipelineSkeleton />
                ) :
                    leadsData?.length === 0 ? (
                        <div className="col-span-full text-center py-10 bg-white rounded-xl border">
                            <p className="text-gray-500">No leads found to display...</p>
                        </div>
                    ) : (
                        groupedLeads?.map((column) => (
                            <div
                                key={column.stage}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverStage(column.stage);
                                }}
                                onDrop={() => {
                                    handleDrop(column.stage);
                                    setDragOverStage(null);
                                }}
                                onDragLeave={() => setDragOverStage(null)}
                                className={`bg-gray-50 rounded-xl p-3 transition 
                                    ${dragOverStage === column.stage ? "bg-blue-50 border-2 border-blue-400" : ""}
                                `}>

                                {/* COLUMN HEADER */}
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-semibold text-gray-700">
                                        {column.stage}
                                    </h2>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                        {column.items.length}
                                    </span>
                                </div>

                                {/* CARDS */}
                                <div className="space-y-3" >

                                    {
                                        column.items.map((lead) => (
                                            <div
                                                key={lead.id}
                                                draggable
                                                onDragStart={() => setDraggedLead(lead)}
                                                onDragEnd={() => setDraggedLead(null)}
                                                className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition"
                                            >

                                                <h3 className="font-medium text-gray-800">
                                                    {lead.fullName}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    {lead.companyName}
                                                </p>

                                                <div className="flex justify-between items-center mt-2">

                                                    <span className="text-sm font-semibold text-blue-600">
                                                        {lead.dealValue}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            disabled={deleteLoading[lead.id]}
                                                            onClick={() => {
                                                                toggleEditLeadModal();
                                                                saveEdit(lead);
                                                            }}
                                                            className="text-xs text-amber-500 font-medium hover:text-amber-600">
                                                            Edit
                                                        </button>

                                                        <button
                                                            disabled={deleteLoading[lead.id]}
                                                            onClick={() => deleteLeadHandler(lead.id)}
                                                            className="text-xs text-red-500 font-medium hover:text-red-700">
                                                            {deleteLoading[lead.id] ? "Deleting..." : "Delete"}
                                                        </button>

                                                        <button
                                                            disabled={deleteLoading[lead.id]}
                                                            onClick={() => {
                                                                handleView(lead);
                                                            }}
                                                            className="text-xs text-indigo-500 font-medium hover:text-blue-500">
                                                            View
                                                        </button>
                                                    </div>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>

                            </div>
                        ))
                    )}

            </div >
            {
                isAddLeadModalOpen && (
                    <div>
                        <AddLeadModal
                            onClose={toggleAddLeadModal}
                            editingId={editingId}
                        />
                    </div>
                )
            }
            {
                isEditLeadModalOpen && editingId !== null && (
                    <div>
                        <EditLeadModal
                            onClose={toggleEditLeadModal}
                            editData={editData}
                            editingId={editingId}
                        />
                    </div>
                )
            }
            {
                isViewLeadOpen && (
                    <div>
                        <ViewLeadModal
                            onClose={toggleViewLeadModal}
                            lead={selectedLead}
                        />
                    </div>
                )
            }
        </div >
    );
};

export default Leads;