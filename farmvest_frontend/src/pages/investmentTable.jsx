
const InvestmentTable = () => {
    const data = [
        { title: 'My family farm', investment: '$72,500', date: '23 Dec 2022', profit: '$72,500', progress: 98 },
        { title: 'My family farm', investment: '$72,500', date: '23 Dec 2022', profit: '$72,500', progress: 98 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },
        { title: 'Greenhouse farm', investment: '$77,500', date: '23 Dec 2022', profit: '$77,500', progress: 56 },    ];

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full">
            <table className="table-auto w-full text-left text-sm">
                <thead>
                <tr className="bg-gray-700 text-gray-300">
                    <th className="p-3">Title</th>
                    <th className="p-3">Investment</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Profit</th>
                    <th className="p-3">Farm Progress</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index} className={`hover:bg-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : ''}`}>
                        <td className="p-3">{row.title}</td>
                        <td className="p-3">{row.investment}</td>
                        <td className="p-3">{row.date}</td>
                        <td className="p-3">{row.profit}</td>
                        <td className="p-3">
                            <progress value={row.progress} max="100" className="w-full h-2 rounded-lg bg-gray-600"></progress>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvestmentTable;
