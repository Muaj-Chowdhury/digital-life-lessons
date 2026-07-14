import { NavLink } from "react-router";

const SidebarItem = ({ icon, label, to, collapsed, end, onClick }) => {
  return (
    <li className="list-none">
      <div 
        className={`${collapsed ? "tooltip tooltip-right block before:z-[100] after:z-[1000]" : "block"} w-full`} 
        data-tip={label}
      >
        <NavLink
          to={to}
          end={end}
          onClick={onClick}
          className={({ isActive }) => `
            flex items-center gap-3 p-3 rounded-xl transition-all duration-300
            ${isActive 
              ? "bg-primary text-white shadow-lg" 
              : "text-base-content/60 hover:bg-base-200"}
          `}
        >
          <span className="text-xl flex-shrink-0">{icon}</span>
          {!collapsed && (
            <span className="whitespace-nowrap font-bold text-sm">
              {label}
            </span>
          )}
        </NavLink>
      </div>
    </li>
  );
};

export default SidebarItem;