const ErrorMessage = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="text-red-200">{message}</span>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
