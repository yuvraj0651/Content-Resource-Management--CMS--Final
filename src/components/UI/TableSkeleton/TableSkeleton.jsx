const TableSkeleton = ({ rows = 6 }) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse">

                    {/* Checkbox */}
                    <td className="p-3">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </td>

                    {/* Name */}
                    <td className="p-3">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>

                    {/* Email */}
                    <td className="p-3">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </td>

                    {/* Role */}
                    <td className="p-3">
                        <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                        <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
                    </td>

                    {/* Tech Role */}
                    <td className="p-3">
                        <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex gap-2">
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </td>

                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;