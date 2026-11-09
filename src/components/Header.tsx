import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronRight } from 'lucide-react';
import { ROUTES } from '../utils';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle = () => {} }) => {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case ROUTES.LIVE_MONITORING:
        return { title: 'Live Monitoring', breadcrumb: 'Live Monitoring' };
      case ROUTES.GAIT_ANALYSIS:
        return { title: 'Gait Analysis', breadcrumb: 'Gait Analysis' };
      case ROUTES.REPORTS:
        return { title: 'Results & Reports', breadcrumb: 'Results & Reports' };
      case ROUTES.SYSTEM_STATUS:
        return { title: 'System Status', breadcrumb: 'System Status' };
      case ROUTES.SENSOR_PAIR_RANKING:
        return { title: 'Sensor Pair Ranking', breadcrumb: 'Sensor Pair Ranking' };
      case ROUTES.HOME:
      case ROUTES.DASHBOARD:
      default:
        return { title: 'Dashboard', breadcrumb: 'Dashboard' };
    }
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Page Info / Breadcrumbs */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-[#718096] hover:text-[#172B4D] hover:bg-[#F7F8FA] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1.5 text-xs text-[#718096]" aria-label="Breadcrumb">
            <span>Home</span>
            <ChevronRight className="w-3 h-3 text-[#A0AEC0]" />
            <span className="text-[#172B4D] font-medium">{breadcrumb}</span>
          </nav>
          {/* Page Title */}
          <h1 className="text-lg font-bold text-[#172B4D] tracking-tight leading-none mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: System Status & User Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* System Status Indicator (Green #16A36A) */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A36A] text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse"></span>
          <span>System Online</span>
          <span className="text-[#16A36A]/75 text-[10px] uppercase tracking-wider font-semibold border-l border-[#A7F3D0] pl-2 ml-0.5">
            Simulated
          </span>
        </div>

        {/* User Avatar Placeholder */}
        <div className="flex items-center space-x-3 pl-2 sm:pl-3 sm:border-l sm:border-[#E5E7EB]">
          <div className="w-9 h-9 rounded-full bg-[#172B4D] text-[#FFF1E8] border border-[#243B5A] flex items-center justify-center font-semibold text-xs tracking-wider shadow-xs">
            KL
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-[#172B4D] leading-tight">
              Researcher
            </div>
            <div className="text-[11px] text-[#718096] leading-tight">
              Station ID: #01
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
