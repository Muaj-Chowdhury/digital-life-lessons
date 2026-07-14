import React from 'react';
import SideBar from '../component/dashboard/SIdebar/SideBar';
import { Outlet } from 'react-router';

const Dashboard = () => {
    return (
        <div className='relative min-h-screen md:flex bg-white'>
            {/* Left side : Sidebar component */}
            <div className=''>
                <SideBar></SideBar>
            </div>
            {/* Right side : Dashboard content */}
            <div className='flex-1 '>
                <div className=''>
                    {/* This is where nested routes will be rendered */}
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;