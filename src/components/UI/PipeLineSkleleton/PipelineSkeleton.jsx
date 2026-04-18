const PipelineSkeleton = ({ columns = 4, cardsPerColumn = 3 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {[...Array(columns)].map((_, colIndex) => (
                <div key={colIndex} className="bg-gray-50 rounded-xl p-3">

                    {/* COLUMN HEADER */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>

                    {/* CARDS */}
                    <div className="space-y-3">
                        {[...Array(cardsPerColumn)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-3 rounded-lg border shadow-sm"
                            >
                                {/* TITLE */}
                                <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>

                                {/* SUBTITLE */}
                                <div className="h-3 w-24 bg-gray-200 rounded mb-3 animate-pulse"></div>

                                {/* FOOTER */}
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>

                                    <div className="flex gap-2">
                                        <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            ))}

        </div>
    );
};

export default PipelineSkeleton;