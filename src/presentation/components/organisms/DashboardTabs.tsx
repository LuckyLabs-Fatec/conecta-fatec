import React from 'react';

interface DashboardTabsProps {
    activeTab: 'proposals' | 'projects';
    onTabChange: (tab: 'proposals' | 'projects') => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
    return (
        <div className="flex border-b border-gray-200 mb-6">
            <button
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'proposals'
                        ? 'text-[var(--cps-blue-base)]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                onClick={() => onTabChange('proposals')}
            >
                Propostas
                {activeTab === 'proposals' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--cps-blue-base)]" />
                )}
            </button>
            <button
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'projects'
                        ? 'text-[var(--cps-blue-base)]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                onClick={() => onTabChange('projects')}
            >
                Projetos
                {activeTab === 'projects' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--cps-blue-base)]" />
                )}
            </button>
        </div>
    );
};
