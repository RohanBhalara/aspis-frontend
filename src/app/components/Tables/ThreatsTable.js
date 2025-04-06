"use client"
import { fetchThreats } from '@/app/api/threats';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';


export default function ThreatsTable() {
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchThreats({ setLoading, setThreats, setTotalCount, currentPage });
    }, [currentPage]);

    // Apply filtering and sorting
    const processedThreats = useMemo(() => {
        let result = [...threats];

        // Apply filter
        if (filter) {
            result = result.filter(threat => threat.threat === filter);
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // For dates
                if (sortConfig.key === 'date_added') {
                    return sortConfig.direction === 'asc'
                        ? new Date(aValue) < new Date(bValue)
                        : new Date(bValue) > new Date(aValue);
                }

                // For strings
                if (typeof aValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                // For numbers
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }

        return result;
    }, [threats, filter, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilter = (type) => {
        setFilter(type);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const TableHeading = () => {
        return (
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Threat Monitoring</h2>
                <div className="mt-2 text-gray-700">
                    <label className="mr-2">Filter by Threat Type:</label>
                    <select
                    value={filter}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="border rounded px-2 py-1"
                    >
                        <option value="">All</option>
                        <option value="malware_download">Malware</option>
                        <option value="phishing">Phishing</option>
                        <option value="ddos">DDoS</option>
                    </select>
                </div>
            </div>
        )
    }

    const TableHeader = () => {
        return (
            <thead className="bg-gray-50">
                <tr>
                    <th
                        onClick={() => handleSort('reporter')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                        Reporter {sortConfig.key === 'reporter' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                        Host
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                        URL
                    </th>
                    <th
                        onClick={() => handleSort('threat')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                        Threat Type {sortConfig.key === 'threat' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                        onClick={() => handleSort('date_added')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                        Date Added {sortConfig.key === 'date_added' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>
                        {/* Occupied for external link */}
                    </th>
                </tr>
            </thead>
        )
    }

    const TableRow = ({ threat }) => {
        return (
            <tr key={threat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{threat.reporter}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {threat.host}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    <a href={threat.url} target="_blank">
                        {threat.url}
                    </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full 
                            ${threat.threat === 'malware_download' ? 'bg-red-100 text-red-800' :
                            threat.threat === 'phishing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'}`}>
                        {threat.threat}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(threat.date_added).toLocaleDateString()}
                </td>
                <td>
                    <Link href={threat.urlhaus_reference}>
                        <Image src='/external-link.png' width={30} height={30} alt='View link' />
                    </Link>
                </td>
            </tr>
        )
    }

    const TableContent = () => {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                {loading || !processedThreats.length ?
                    <tr>
                        <td colSpan={5} className="text-gray-500 px-6 py-4">
                            {loading && <>Loading...</>}
                            {!processedThreats.length && <>Nothing to show</>}
                        </td>
                    </tr>
                    :
                    <>
                        {processedThreats.map((threat, index) => <TableRow key={index} threat={threat} />)}
                    </>}
            </tbody>
        )
    }

    const Pagination = () => {
        return (
            <div className="px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, totalCount)}</span> of{' '}
                    <span className="font-medium">{totalCount}</span> threats
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-gray-700"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage * 10 >= totalCount}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-gray-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <TableHeading />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <TableHeader />

                        <TableContent />
                    </table>
                </div>

                <Pagination />
            </div>
        </div>
    );
}