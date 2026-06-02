import React from 'react';

interface DashboardTabsProps {
    activeTab: 'proposals' | 'projects';
    onTabChange: (tab: 'proposals' | 'projects') => void;
    projectsDisabled?: boolean;
}

export const DashboardTabs = ({ activeTab, onTabChange, projectsDisabled = false }: DashboardTabsProps) => {
    return (
        <div className="flex border-b border-[var(--cps-gray-light)] mb-6">
            <button
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'proposals'
                        ? 'text-[var(--cps-blue-base)]'
                        : 'text-[var(--cps-gray-text)] hover:text-[var(--cps-gray-text)]'
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
                        : projectsDisabled
                            ? 'text-[var(--cps-gray-light)] cursor-not-allowed'
                            : 'text-[var(--cps-gray-text)] hover:text-[var(--cps-gray-text)]'
                    }`}
                onClick={() => {
                    if (!projectsDisabled) onTabChange('projects');
                }}
                disabled={projectsDisabled}
            >
                Projetos
                {activeTab === 'projects' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--cps-blue-base)]" />
                )}
            </button>
        </div>
    );
};
