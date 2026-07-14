import React from "react";
import { BsGraphUp } from "react-icons/bs";
import { FaChartLine } from "react-icons/fa6";
import SidebarItem from "../dashboard/SIdebar/SidebarItem"; // Ensure path is correct
import useRole from "../../hooks/useRole";

const Statistics = ({ collapsed }) => {
  const { role } = useRole();

  return (
    <>
      <SidebarItem
        icon={<BsGraphUp />}
        label="User Statistics"
        to="/dashboard"
        collapsed={collapsed}
        end={true} 
      />

      {role === "admin" && (
        <SidebarItem
          icon={<FaChartLine />}
          label="Admin Statistics"
          to="/dashboard/admin"
          collapsed={collapsed}
        />
      )}
    </>
  );
};

export default Statistics;