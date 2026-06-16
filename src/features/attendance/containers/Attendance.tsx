"use client"

import React, { useState } from 'react';
import { Calendar, BarChart3, Table, TrendingUp, Users } from 'lucide-react';

const attendanceData = [
    {
        date: "Jul 7, 2025",
        time: "9:00 AM - 12:00 PM",
        category: "Sunday",
        church: "2",
        sermon: "Believing in God",
        speaker: "Pastor Nyaungwa",
        scripture: "Matthew 6:1",
        total: 100,
        adults: 70,
        children: 30,
        visitors: 10,
        altarCall: 10,
        baptisms: 10
    },
    {
        date: "Jan 21, 2024",
        time: "11:00 AM - 2:00 PM",
        category: "Sunday",
        church: "2",
        sermon: "Living with Purpose",
        speaker: "Guest Speaker - Rev. Samuel Bekele",
        scripture: "Jeremiah 29:11, Romans 8:28",
        total: 289,
        adults: 210,
        children: 58,
        visitors: 19,
        altarCall: 18,
        baptisms: 2
    },
    {
        date: "Jan 14, 2024",
        time: "11:00 AM - 1:45 PM",
        category: "Sunday",
        church: "2",
        sermon: "The Power of Prayer",
        speaker: "Pastor John Smith",
        scripture: "Matthew 6:5-15, James 5:16",
        total: 267,
        adults: 195,
        children: 52,
        visitors: 18,
        altarCall: 15,
        baptisms: 1
    },
    {
        date: "Jan 12, 2024",
        time: "9:00 PM - 11:15 PM",
        category: "Friday",
        church: "2",
        sermon: "Healing and Restoration",
        speaker: "Pastor Sarah Williams",
        scripture: "Isaiah 53:5, 1 Peter 2:24",
        total: 92,
        adults: 78,
        children: 8,
        visitors: 5,
        altarCall: 20,
        baptisms: null
    },
    {
        date: "Jan 10, 2024",
        time: "9:30 PM - 11:30 PM",
        category: "Homecell",
        church: "2",
        sermon: "Growing in Grace",
        speaker: "Elder Michael Brown",
        scripture: "2 Peter 3:18, Ephesians 4:15",
        total: 22,
        adults: 18,
        children: 4,
        visitors: 1,
        altarCall: 5,
        baptisms: null
    },
    {
        date: "Jan 7, 2024",
        time: "11:00 AM - 1:30 PM",
        category: "Sunday",
        church: "2",
        sermon: "Walking in Faith",
        speaker: "Pastor John Smith",
        scripture: "Hebrews 11:1-6, Romans 10:17",
        total: 245,
        adults: 180,
        children: 45,
        visitors: 15,
        altarCall: 12,
        baptisms: 3
    },
    {
        date: "Jan 5, 2024",
        time: "9:00 PM - 11:00 PM",
        category: "Friday",
        church: "2",
        sermon: "Prayer and Fasting",
        speaker: "Elder Mary Johnson",
        scripture: "Matthew 6:16-18, Joel 2:12",
        total: 85,
        adults: 70,
        children: 10,
        visitors: 3,
        altarCall: 8,
        baptisms: null
    }
];

const AttendanceVisualizations = () => {
    const [view, setView] = useState('improved-table');

    const categoryColors = {
        Sunday: 'bg-theme-100 text-theme-700 border-theme-200',
        Friday: 'bg-purple-100 text-purple-700 border-purple-200',
        Homecell: 'bg-green-100 text-green-700 border-green-200'
    };

    const renderImprovedTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
                        <th className="px-4 py-3 text-left text-sm font-semibold border-r border-theme-500">Date & Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-r border-theme-500">Service Info</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold border-r border-theme-500">Total</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold border-r border-theme-500">Adults</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold border-r border-theme-500">Children</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold border-r border-theme-500">Visitors</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold border-r border-theme-500">Altar Call</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Baptisms</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((record, idx) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-theme-50 transition-colors`}>
                            <td className="px-4 py-4 border-b border-r">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{record.date}</span>
                                    <span className="text-xs text-gray-600">{record.time}</span>
                                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[record.category as keyof typeof categoryColors]} border w-fit`}>
                                        {record.category}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-4 border-b border-r max-w-xs">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-gray-800">{record.sermon}</span>
                                    <span className="text-sm text-gray-600">by {record.speaker}</span>
                                    <span className="text-xs text-theme-600">{record.scripture}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4 border-b border-r text-center">
                                <span className="inline-block px-3 py-1 bg-theme-600 text-white font-bold rounded-lg text-lg">{record.total}</span>
                            </td>
                            <td className="px-4 py-4 border-b border-r text-center font-semibold text-gray-700">{record.adults}</td>
                            <td className="px-4 py-4 border-b border-r text-center font-semibold text-gray-700">{record.children}</td>
                            <td className="px-4 py-4 border-b border-r text-center">
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 font-semibold rounded">{record.visitors}</span>
                            </td>
                            <td className="px-4 py-4 border-b border-r text-center">
                                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 font-semibold rounded">{record.altarCall}</span>
                            </td>
                            <td className="px-4 py-4 border-b text-center">
                                <span className={`inline-block px-2 py-1 font-semibold rounded ${record.baptisms ? 'bg-theme-100 text-theme-700' : 'text-gray-400'}`}>
                                    {record.baptisms || '—'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCards = () => (
        <div className="grid grid-cols-1 gap-6">
            {attendanceData.map((record, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
                    <div className={`px-6 py-4 ${record.category === 'Sunday' ? 'bg-theme-600' : record.category === 'Friday' ? 'bg-purple-600' : 'bg-green-600'}`}>
                        <div className="flex justify-between items-start">
                            <div className="text-white">
                                <h3 className="font-bold text-xl">{record.sermon}</h3>
                                <p className="text-sm opacity-90 mt-1">by {record.speaker}</p>
                                <p className="text-xs opacity-80 mt-1">{record.scripture}</p>
                            </div>
                            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm font-semibold">
                                {record.category}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">{record.date}</span>
                            <span className="text-sm">• {record.time}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-theme-200">
                                <div className="text-theme-600 text-sm font-semibold mb-1">Total</div>
                                <div className="text-3xl font-bold text-theme-700">{record.total}</div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-gray-600 text-sm font-semibold mb-1">Adults</div>
                                <div className="text-2xl font-bold text-gray-700">{record.adults}</div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-gray-600 text-sm font-semibold mb-1">Children</div>
                                <div className="text-2xl font-bold text-gray-700">{record.children}</div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="text-green-600 text-sm font-semibold mb-1">Visitors</div>
                                <div className="text-2xl font-bold text-green-700">{record.visitors}</div>
                            </div>

                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                <div className="text-red-600 text-sm font-semibold mb-1">Altar Call</div>
                                <div className="text-2xl font-bold text-red-700">{record.altarCall}</div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <div className="text-purple-600 text-sm font-semibold mb-1">Baptisms</div>
                                <div className="text-2xl font-bold text-purple-700">{record.baptisms || '—'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTimeline = () => (
        <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-600 to-purple-600"></div>

            {attendanceData.map((record, idx) => (
                <div key={idx} className="relative pl-20 pb-8 group">
                    <div className={`absolute left-5 w-6 h-6 rounded-full border-4 border-white shadow-lg ${record.category === 'Sunday' ? 'bg-theme-600' :
                            record.category === 'Friday' ? 'bg-purple-600' : 'bg-green-600'
                        }`}></div>

                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-lg text-gray-800">{record.date}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[record.category as keyof typeof categoryColors]} border`}>
                                        {record.category}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{record.time}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600 mb-1">Total Attendance</div>
                                <div className="text-3xl font-bold text-theme-600">{record.total}</div>
                            </div>
                        </div>

                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-800">{record.sermon}</div>
                            <div className="text-sm text-gray-600 mt-1">by {record.speaker}</div>
                            <div className="text-xs text-theme-600 mt-1">{record.scripture}</div>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">Adults</div>
                                <div className="text-lg font-bold text-gray-700">{record.adults}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">Children</div>
                                <div className="text-lg font-bold text-gray-700">{record.children}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-green-600 mb-1">Visitors</div>
                                <div className="text-lg font-bold text-green-700">{record.visitors}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-red-600 mb-1">Altar Call</div>
                                <div className="text-lg font-bold text-red-700">{record.altarCall}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-purple-600 mb-1">Baptisms</div>
                                <div className="text-lg font-bold text-purple-700">{record.baptisms || '—'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderCompact = () => (
        <div className="space-y-3">
            {attendanceData.map((record, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-800">{record.date}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[record.category as keyof typeof categoryColors]} border`}>
                                    {record.category}
                                </span>
                            </div>
                            <div className="text-sm font-semibold text-gray-700">{record.sermon}</div>
                            <div className="text-xs text-gray-600">{record.speaker}</div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-theme-600">{record.total}</div>
                                <div className="text-xs text-gray-600">Total</div>
                            </div>

                            <div className="h-10 w-px bg-gray-300"></div>

                            <div className="flex gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-bold text-gray-700">{record.adults}</div>
                                    <div className="text-xs text-gray-600">Adults</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-700">{record.children}</div>
                                    <div className="text-xs text-gray-600">Children</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-green-700">{record.visitors}</div>
                                    <div className="text-xs text-green-600">Visitors</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-red-700">{record.altarCall}</div>
                                    <div className="text-xs text-red-600">Altar</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-purple-700">{record.baptisms || '—'}</div>
                                    <div className="text-xs text-purple-600">Baptisms</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Church Attendance Dashboard</h1>
                    <p className="text-gray-600 mb-6">Explore different visualization methods for attendance data</p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setView('improved-table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'improved-table'
                                    ? 'bg-theme-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Table className="w-4 h-4" />
                            Enhanced Table
                        </button>

                        <button
                            onClick={() => setView('cards')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'cards'
                                    ? 'bg-theme-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Card View
                        </button>

                        <button
                            onClick={() => setView('timeline')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'timeline'
                                    ? 'bg-theme-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Timeline View
                        </button>

                        <button
                            onClick={() => setView('compact')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'compact'
                                    ? 'bg-theme-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Compact List
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    {view === 'improved-table' && renderImprovedTable()}
                    {view === 'cards' && renderCards()}
                    {view === 'timeline' && renderTimeline()}
                    {view === 'compact' && renderCompact()}
                </div>
            </div>
        </div>
    );
};

export default AttendanceVisualizations;