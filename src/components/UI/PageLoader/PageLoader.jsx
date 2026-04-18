const PageLoader = () => {
    return (
        <div className="h-screen flex items-center justify-center text-gray-600 text-sm">
            Loading
            <span className="ml-1 animate-pulse">.</span>
            <span className="animate-pulse">.</span>
            <span className="animate-pulse">.</span>
        </div>
    );
};

export default PageLoader;