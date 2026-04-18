const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="text-center max-w-lg w-full">

                {/* BIG 404 */}
                <h1 className="text-7xl font-bold text-blue-500 mb-2 animate-pulse">
                    404
                </h1>

                {/* TITLE */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Page Not Found
                </h2>

                {/* DESC */}
                <p className="text-gray-500 mb-6">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>

                {/* ACTIONS */}
                <div className="flex justify-center gap-3">

                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                        Go Back
                    </button>

                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Go to Dashboard
                    </button>

                </div>

                {/* DECORATIVE CARD */}
                <div className="mt-10 bg-white border rounded-xl shadow-sm p-4 text-sm text-gray-500">
                    💡 Tip: Check the URL or navigate using sidebar menu.
                </div>

            </div>

        </div>
    );
};

export default NotFoundPage;