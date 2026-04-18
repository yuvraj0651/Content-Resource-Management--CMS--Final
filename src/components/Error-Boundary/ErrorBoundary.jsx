import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
        };
    };

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error: error,
        };
    };

    componentDidCatch(error, info) {
        console.log("This component is giving you error:", info);
        console.log("This is the error occurring: ", error);
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                    <div className="bg-white border shadow-sm rounded-2xl p-8 max-w-md w-full text-center">

                        {/* ICON */}
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
                                <span className="text-red-600 text-2xl">⚠️</span>
                            </div>
                        </div>

                        {/* TITLE */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Something went wrong
                        </h2>

                        {/* MESSAGE */}
                        <p className="text-gray-500 text-sm mb-6">
                            An unexpected error occurred. Please try refreshing the page or come back later.
                        </p>

                        {/* ACTIONS */}
                        <div className="flex justify-center gap-3">

                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Reload Page
                            </button>

                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            >
                                Go to Dashboard
                            </button>

                        </div>

                    </div>

                </div>
            )
        }
        return (
            <>
                {this.props.children}
            </>
        )
    }
};

export default ErrorBoundary;