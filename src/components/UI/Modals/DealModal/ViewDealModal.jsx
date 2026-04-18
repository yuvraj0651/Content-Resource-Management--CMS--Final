import React from "react";
import { createPortal } from "react-dom";

const ViewDealModal = ({ onClose, deal }) => {

    if (!deal) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Deal Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* CONTENT */}
                <div className="space-y-4 text-sm">

                    {/* DEAL NAME */}
                    <div>
                        <p className="text-gray-500">Deal Name</p>
                        <p className="font-medium text-gray-800">
                            {deal.dealName || deal.name}
                        </p>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <p className="text-gray-500">Company</p>
                        <p className="font-medium text-gray-800">
                            {deal.companyName || deal.company}
                        </p>
                    </div>

                    {/* VALUE */}
                    <div>
                        <p className="text-gray-500">Deal Value</p>
                        <p className="font-semibold text-green-600">
                            {deal.dealValue || deal.value}
                        </p>
                    </div>

                    {/* STAGE + PRIORITY */}
                    <div className="flex justify-between items-center">

                        <div>
                            <p className="text-gray-500">Stage</p>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                {deal.stage}
                            </span>
                        </div>

                        <div>
                            <p className="text-gray-500">Priority</p>
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${deal.priority === "High"
                                    ? "bg-red-100 text-red-600"
                                    : deal.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {deal.priority}
                            </span>
                        </div>

                    </div>

                    {/* ASSIGNED TO */}
                    <div>
                        <p className="text-gray-500">Assigned To</p>
                        <p className="font-medium text-gray-800">
                            {deal.assignedTo || "Not Assigned"}
                        </p>
                    </div>

                    {/* DATE */}
                    <div>
                        <p className="text-gray-500">Expected Close Date</p>
                        <p className="font-medium text-gray-800">
                            {deal.date || "N/A"}
                        </p>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <p className="text-gray-500">Description</p>
                        <p className="text-gray-700">
                            {deal.description || "No description provided"}
                        </p>
                    </div>

                </div>

                {/* ACTION */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Close
                    </button>
                </div>

            </div>

        </div>,
        document.getElementById("modal-root")
    );
};

export default ViewDealModal;