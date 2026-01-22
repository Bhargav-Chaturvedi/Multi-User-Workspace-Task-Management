const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`spinner ${sizeClasses[size]}`}></div>
        </div>
    );
};

export default LoadingSpinner;
