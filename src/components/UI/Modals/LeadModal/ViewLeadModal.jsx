import { useDispatch } from "react-redux";
import { convertLeadToDeal } from "../../../Services/Leads/LeadsThunk";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const ViewLeadModal = ({ lead, onClose }) => {

    const dispatch = useDispatch();

    const handleConvert = () => {
        console.log("LEAD DATA:", lead);

        dispatch(convertLeadToDeal(lead))
            .unwrap()
            .then(() => {
                toast.success("Lead converted to Deal");
                onClose();
            })
            .catch((err) => {
                toast.error(err || "Conversion failed");
            });
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            {/* CONTAINER */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Lead Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-4 overflow-y-auto">

                    {/* NAME */}
                    <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{lead.fullName}</p>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{lead.email}</p>
                    </div>

                    {/* PHONE */}
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{lead.phone}</p>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{lead.companyName}</p>
                    </div>

                    {/* DEAL VALUE */}
                    <div>
                        <p className="text-sm text-gray-500">Deal Value</p>
                        <p className="font-medium text-blue-600">{lead.dealValue}</p>
                    </div>

                    {/* STAGE + SOURCE */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <p className="text-sm text-gray-500">Stage</p>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                {lead.stage}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Source</p>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                {lead.leadSource}
                            </span>
                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-sm text-gray-700">
                            {lead.description || "No notes available"}
                        </p>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex flex-col sm:flex-row justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 border rounded-lg"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleConvert}
                        className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Convert to Deal
                    </button>

                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default ViewLeadModal;