import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {isLoading : roleLoading, data : role } = useQuery({
        enabled: !!user?.email,
        queryKey: ["user-role", user?.email],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/users/${user?.email}`)
            return res?.data.role;
        }
    })

    return {roleLoading , role};
};

export default useRole;