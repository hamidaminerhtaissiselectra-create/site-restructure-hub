import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface MobileTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const MobileTabBar = ({ tabs, activeTab, onTabChange }: MobileTabBarProps) => {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed tab bar */}
      <div className="h-20 md:hidden" />
      
      {/* Fixed Tab Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch justify-around h-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1",
                  "transition-colors duration-200 min-w-0",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                
                {/* Icon with badge */}
                <div className="relative">
                  <Icon 
                    className={cn(
                      "h-6 w-6 transition-transform",
                      isActive && "scale-110"
                    )} 
                  />
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </span>
                  )}
                </div>
                
                {/* Label - always visible for accessibility */}
                <span 
                  className={cn(
                    "text-[11px] font-medium leading-tight truncate max-w-full",
                    isActive && "font-semibold"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileTabBar;
