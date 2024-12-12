import React from 'react';
import Dashboard from '../../admin/components/dashboard';
import Sidebar from '../../admin/components/sidebar';
import { Helmet } from "react-helmet";

const Admin = () => {
    return (
        <div className="flex">
            <Helmet>
                <title>Admin | Mera Bestie</title>
            </Helmet>
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <div className="flex-1">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
};

export default Admin;
