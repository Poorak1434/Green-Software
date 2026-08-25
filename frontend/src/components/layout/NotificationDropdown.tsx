import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Info,
  Check,
  Trash2,
  ExternalLink,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface NotificationItem {
  id: string;
  type: 'leak' | 'power' | 'eco' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'critical' | 'warning' | 'success' | 'info';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'leak',
    title: 'High Flow Rate Anomaly Detected',
    message: 'Flow meter 01 registered 28.5 L/min spike. Auto-cutoff triggered.',
    timestamp: '5m ago',
    read: false,
    severity: 'critical',
  },
  {
    id: 'n2',
    type: 'power',
    title: 'Unusual Power Surge Alert',
    message: 'Main HVAC compressor draw surged 160% above baseline wattage.',
    timestamp: '42m ago',
    read: false,
    severity: 'warning',
  },
  {
    id: 'n3',
    type: 'eco',
    title: 'Monthly Conservation Goal Reached',
    message: 'Your property saved 1,250 Liters of water and 45.2 kWh of grid energy.',
    timestamp: '2h ago',
    read: false,
    severity: 'success',
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Rainwater Routing Protocol Active',
    message: 'Cistern level at 85%. Secondary flush lines diverted to rainwater.',
    timestamp: '4h ago',
    read: true,
    severity: 'info',
  },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) =>
    activeTab === 'unread' ? !n.read : true
  );

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'leak':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'power':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'eco':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  const getBadgeStyle = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 border-rose-400/30 text-rose-600';
      case 'warning':
        return 'bg-amber-500/10 border-amber-400/30 text-amber-600';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-400/30 text-emerald-600';
      case 'info':
      default:
        return 'bg-sky-500/10 border-sky-400/30 text-sky-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-emerald-600 transition-colors rounded-full btn-soft"
        aria-label="Toggle Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#eef2f6] shadow-sm">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#f4f7fa] border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18)] rounded-3xl z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-700">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Read All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-slate-200/60 flex gap-2 bg-slate-100/80">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'all'
                    ? 'panel-soft-inset text-emerald-600 border border-emerald-400/40 bg-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'unread'
                    ? 'panel-soft-inset text-emerald-600 border border-emerald-400/40 bg-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 hide-scrollbar bg-[#f4f7fa]">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-bold text-xs">
                  No notifications to show.
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-start gap-3 border ${
                      !item.read
                        ? 'bg-white border-emerald-300/80 shadow-sm'
                        : 'bg-white/60 border-slate-200/50 hover:bg-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${getBadgeStyle(item.severity)} shrink-0`}>
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-extrabold truncate ${!item.read ? 'text-slate-800' : 'text-slate-600'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-bold mt-1 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <button
                      onClick={(e) => deleteNotification(item.id, e)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Remove notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer View All Link */}
            <div className="p-3 border-t border-slate-200/80 bg-white text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/alerts');
                }}
                className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 w-full py-1 transition-colors"
              >
                <span>View All Alerts & Anomalies</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
