const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="bg-white border shadow-sm rounded-2xl p-8 max-w-md w-full text-center">

                {/* ICON */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100">
                        <span className="text-yellow-600 text-2xl">🔒</span>
                    </div>
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Access Denied
                </h2>

                {/* DESC */}
                <p className="text-gray-500 text-sm mb-6">
                    You don’t have permission to access this page. Please contact your admin or switch account.
                </p>

                {/* ACTIONS */}
                <div className="flex justify-center gap-3">

                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                        Go Back
                    </button>

                </div>

                {/* FOOT NOTE */}
                <p className="text-xs text-gray-400 mt-4">
                    Error Code: 403 Unauthorized Access
                </p>

            </div>

        </div>
    );
};

export default UnauthorizedPage;