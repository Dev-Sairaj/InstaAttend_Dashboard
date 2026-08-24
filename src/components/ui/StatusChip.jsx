const StatusChip = ({ status }) => {
    const statusStyles = {
        Present: "bg-green-100 text-green-700",
        Absent: "bg-red-100 text-red-700",
        Late: "bg-yellow-100 text-yellow-700",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusStyles[status] || "bg-blue-100 text-blue-700"}`}>
            {status}
        </span>
    );
};

export default StatusChip;
