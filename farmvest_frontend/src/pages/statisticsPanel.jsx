
const StatisticsPanel = () => {
    return (
        <div className="bg-gray-800 rounded-lg p-6 flex-1 space-y-4">
            <h3 className="text-lg font-semibold">Farm Investment Statistics</h3>
            <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
            <h3 className="text-lg font-semibold">My Wallet Insights</h3>
            <div className="flex space-x-4">
                <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Review</button>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Learn more</button>
            </div>
            <h3 className="text-lg font-semibold">Recent Investments</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
                <li className="text-gray-300">Invested: $12,000</li>
                <li className="text-gray-300">Received: $18,000</li>
                <li className="text-gray-300">Withdrawn: $5,000</li>
            </ul>
        </div>
    );
};

export default StatisticsPanel;
