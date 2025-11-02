"use client"

import React, { useState, useMemo } from 'react';
import {
    IconDots,
    IconCircleCheckFilled,
    IconCircle,
    IconPlus,
    IconGridDots,
    IconTimeline,
    IconChevronDown,
    IconChevronUp,
    IconSearch,
    IconEdit,
    IconCheck
} from '@tabler/icons-react';

// Types
interface Section {
    id: string;
    title: string;
    submitted: boolean;
}

interface Report {
    id: string;
    month: string;
    year: number;
    sections: Section[];
    status: 'missing' | 'draft' | 'finalized';
    lastUpdated?: string;
}

// Sample Data
const generateReports = (): Report[] => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const sections = [
        { id: 'attendance', title: 'Attendance', submitted: false },
        { id: 'expenses', title: 'Expenses', submitted: false },
        { id: 'income', title: 'Income', submitted: false },
        { id: 'tithes', title: 'Tithes', submitted: false }
    ];

    return months.map((month, index) => {
        let status: 'missing' | 'draft' | 'finalized' = 'missing';
        let reportSections = [...sections];

        if (index === 1) { // February - finalized
            status = 'finalized';
            reportSections = sections.map(s => ({ ...s, submitted: true }));
        } else if (index === 0 || index === 2) { // January, March - drafts
            status = 'draft';
            reportSections = sections.map((s, i) => ({ ...s, submitted: i < 2 }));
        } else if (index === 4) { // May - finalized
            status = 'finalized';
            reportSections = sections.map(s => ({ ...s, submitted: true }));
        }

        return {
            id: `report-${index}`,
            month,
            year: 2025,
            sections: reportSections,
            status,
            lastUpdated: status !== 'missing' ? '2025-01-15' : undefined
        }
    })
}

// Utility function
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

// Mini Report Card Component
function MiniReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
    const completedCount = report.sections.filter(s => s.submitted).length;
    const completionPercent = Math.round((completedCount / report.sections.length) * 100);

    const getStatusConfig = () => {
        switch (report.status) {
            case 'finalized':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
                    badge: 'bg-green-500 text-white',
                    icon: <IconCheck className="size-3" />,
                    label: 'Finalized'
                };
            case 'draft':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
                    badge: 'bg-amber-500 text-white',
                    icon: <IconEdit className="size-3" />,
                    label: 'Draft'
                };
            default:
                return {
                    bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                    badge: 'bg-slate-400 text-white',
                    icon: <IconPlus className="size-3" />,
                    label: 'Missing'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div onClick={onClick} className={cn('border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]', config.bg)}>
            <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{report.month}</h4>
                <button className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors">
                    <IconDots className="size-5 text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            {report.status === 'missing' ? (
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl shadow-md mb-3">
                        <IconPlus className="size-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No report yet</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Click to start</p>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-600 flex items-center justify-center relative">
                            <svg className="transform -rotate-90 w-10 h-10 absolute inset-0">
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="16"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 16}`}
                                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - completionPercent / 100)}`}
                                    className={cn(
                                        'transition-all duration-700',
                                        report.status === 'finalized' ? 'text-green-500' : 'text-amber-500'
                                    )}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 relative z-10">
                                {completionPercent}%
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {completedCount}/{report.sections.length} Complete
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {report.sections.length - completedCount} remaining
                            </p>
                        </div>
                    </div>

                    <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold', config.badge)}>
                        {config.icon}
                        {config.label}
                    </div>
                </>
            )}
        </div>
    );
}


function TimelineView({ reports, onReportClick }: { reports: Report[]; onReportClick: (report: Report) => void }) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-0 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">2025 Timeline</h3>

            <div className="relative">
                <div className="absolute top-8 left-0 right-0 h-[1px] bg-slate-200 dark:bg-slate-700 rounded-full"></div>

                <div className="relative grid grid-cols-12 gap-2">
                    {reports.map((report, index) => {
                        const completedCount = report.sections.filter(s => s.submitted).length
                        const completionPercent = Math.round((completedCount / report.sections.length) * 100)

                        const getStatusColor = () => {
                            if (report.status === 'finalized') return 'bg-emerald-500 ring-green-200 dark:ring-green-900';
                            if (report.status === 'draft') return 'bg-amber-500 ring-amber-200 dark:ring-amber-900';
                            return 'bg-slate-300 dark:bg-slate-600 ring-slate-200 dark:ring-slate-700';
                        };

                        return (
                            <div
                                key={report.id}
                                className="flex flex-col items-center cursor-pointer group"
                                onClick={() => onReportClick(report)}
                            >
                                {/* Status dot */}
                                <div className={cn(
                                    "size-16 rounded-3xl flex items-center justify-center transition-all duration-300 relative z-10",
                                    getStatusColor(),
                                    "hover:scale-110"
                                )}>
                                    {report.status === "finalized" && <IconCheck className="size-6 text-white" />}
                                    {report.status === "draft" && <span className="text-xs font-bold text-white">{completionPercent}%</span>}
                                    {report.status === "missing" && <IconPlus className="size-5 text-white" />}
                                </div>

                                <span className={cn(
                                    'text-xs font-semibold mt-2 uppercase transition-colors',
                                    report.status === 'missing' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300',
                                    'group-hover:text-blue-500'
                                )}>
                                    {months[index]}
                                </span>

                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {completedCount}/{report.sections.length}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-600 dark:text-slate-400">Finalized</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-slate-600 dark:text-slate-400">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <span className="text-slate-600 dark:text-slate-400">Missing</span>
                </div>
            </div>
        </div>
    );
}

export function ReportsOverview() {
    const [reports] = useState<Report[]>(generateReports());
    const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    // Group reports by status
    const groupedReports = useMemo(() => {
        const filtered = reports.filter(r =>
            r.month.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
            missing: filtered.filter(r => r.status === 'missing'),
            draft: filtered.filter(r => r.status === 'draft'),
            finalized: filtered.filter(r => r.status === 'finalized')
        };
    }, [reports, searchQuery]);

    const toggleSection = (section: string) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(section)) {
            newCollapsed.delete(section);
        } else {
            newCollapsed.add(section);
        }
        setCollapsedSections(newCollapsed);
    };

    const handleReportClick = (report: Report) => {
        setSelectedReport(report);
    };

    const renderGroupSection = (title: string, reports: Report[], icon: React.ReactNode, colorClass: string) => {
        const isCollapsed = collapsedSections.has(title)

        return (
            <div className="mb-6">
                <button
                    onClick={() => toggleSection(title)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-3"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', colorClass)}>
                            {icon}
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{reports.length} reports</p>
                        </div>
                    </div>
                    {isCollapsed ? (
                        <IconChevronDown className="size-5 text-slate-600 dark:text-slate-400" />
                    ) : (
                        <IconChevronUp className="size-5 text-slate-600 dark:text-slate-400" />
                    )}
                </button>

                {!isCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-12">
                        {reports.map(report => (
                            <MiniReportCard key={report.id} report={report} onClick={() => handleReportClick(report)} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen p-0">
            <div className="max-w-7xl mx-auto">
                

                {/* Toolbar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    'p-2 rounded-lg transition-colors',
                                    viewMode === 'grid'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                                )}
                            >
                                <IconGridDots className="size-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={cn(
                                    'p-2 rounded-lg transition-colors',
                                    viewMode === 'timeline'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                                )}
                            >
                                <IconTimeline className="size-5" />
                            </button>
                        </div>

                        {/* Summary Stats */}
                        <div className="flex gap-4">
                            <div className="text-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{groupedReports.finalized.length}</div>
                                <div className="text-xs text-green-600 dark:text-green-400">Finalized</div>
                            </div>
                            <div className="text-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{groupedReports.draft.length}</div>
                                <div className="text-xs text-amber-600 dark:text-amber-400">Drafts</div>
                            </div>
                            <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{groupedReports.missing.length}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Missing</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'timeline' ? (
                    <TimelineView reports={reports} onReportClick={handleReportClick} />
                ) : (
                    <div>
                        {/* Missing Reports */}
                        {groupedReports.missing.length > 0 && renderGroupSection(
                            'Missing Reports',
                            groupedReports.missing,
                            <IconCircle className="size-5 text-slate-500" />,
                            'bg-slate-100 dark:bg-slate-700'
                        )}

                        {/* Draft Reports */}
                        {groupedReports.draft.length > 0 && renderGroupSection(
                            'In Progress',
                            groupedReports.draft,
                            <IconEdit className="size-5 text-amber-500" />,
                            'bg-amber-100 dark:bg-amber-900/30'
                        )}

                        {/* Finalized Reports */}
                        {groupedReports.finalized.length > 0 && renderGroupSection(
                            'Finalized',
                            groupedReports.finalized,
                            <IconCheck className="size-5 text-green-500" />,
                            'bg-green-100 dark:bg-green-900/30'
                        )}
                    </div>
                )}

                {/* Empty State */}
                {searchQuery && [...groupedReports.missing, ...groupedReports.draft, ...groupedReports.finalized].length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No reports found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search query</p>
                    </div>
                )}
            </div>

            {/* Quick Preview Modal (Simple) */}
            {selectedReport && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedReport(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedReport.month} 2025</h3>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2">
                            {selectedReport.sections.map(section => (
                                <div key={section.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    {section.submitted ? (
                                        <IconCircleCheckFilled className="size-5 text-blue-500" />
                                    ) : (
                                        <IconCircle className="size-5 text-slate-400" />
                                    )}
                                    <span className={cn(
                                        'font-medium',
                                        section.submitted ? 'text-blue-500 line-through' : 'text-slate-700 dark:text-slate-300'
                                    )}>
                                        {section.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
                            onClick={() => setSelectedReport(null)}
                        >
                            {selectedReport.status === 'missing' ? 'Create Report' : 'Open Report'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}