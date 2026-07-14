import React from "react";

const ActionBtn = ({ icon, label }) => {
  return (
    <div className="relative group btn">
      
        {icon}
        <span
          className=" border absolute left-5 bottom-9 -translate-x-1/2
                       text-black text-sm px-1 py-1 rounded
                      opacity-0 group-hover:opacity-100 group-hover:z-1
                      transition pointer-events-none whitespace-nowrap
                       hidden md:block bg-white z-50 "
        >
          {label}
        </span>
      
    </div>
  );
};

export default ActionBtn;
