"use client";
import React, { useState } from 'react';
import Header from '@/components/admin/header/page'
import CompanyHeader from '@/components/admin/companyHeader/page';
import Sidebar from '@/components/admin/sidebar/page'
import CompanySidebar from '@/components/admin/companySidebar/page';


const Dashboard = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    return (
        <>
            <div className='main-wrapper'>
                <CompanySidebar sidemenu={`${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`} />
                <div className='rightside'>
                    <CompanyHeader clickEvent={() => { setSidebarVisible(!isSidebarVisible); }} sidebarVisible={isSidebarVisible} />
                    <section className="mx-auto w-full max-w-7xl py-4 px-3 md:px-0">
                        <div className="gap-4 grid md:grid-cols-3 md:space-y-0">
                            <div className="bg-base-100 shadow-xl w-full rounded-md">
                                <div className="card-body">
                                    <div className='flex justify-between'>
                                        <h3 className='font-bold'>Total Company</h3>
                                        <h2 className='font-bold'>45</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-base-100 shadow-xl w-full rounded-md">
                                <div className="card-body">
                                    <div className='flex justify-between'>
                                        <h3 className='font-bold'>Total Users</h3>
                                        <h2 className='font-bold'>45</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-base-100 shadow-xl w-full rounded-md">
                                <div className="card-body">
                                    <div className='flex justify-between'>
                                        <h3 className='font-bold'>Today Attendance</h3>
                                        <h2 className='font-bold'>45</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


        </>
    )
}

export default Dashboard