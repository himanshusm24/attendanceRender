/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react'
import Header from '@/components/admin/header/page'
import CompanyHeader from '@/components/admin/companyHeader/page';
import Sidebar from '@/components/admin/sidebar/page'
import CompanySidebar from '@/components/admin/companySidebar/page';
import BreadCrum from '@/components/admin/breadCrum/page';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';
import { CompanyLists } from '@/api_calls/admin/company/company-list';
import { CreateUser } from '@/api_calls/admin/user/create-user';
import Papa from 'papaparse';
import Link from 'next/link';

const UploadCSV = () => {
    const router = useRouter();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [companyId, setCompanyId] = useState("");
    const [companyList, setCompanyList] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userListCSV, setUserListCSV] = useState([]);

    useEffect(() => {
        getCompanyList();
    }, []);

    const getCompanyList = async () => {
        const data = await CompanyLists();
        const list = data.data.data;
        setCompanyList([...companyList, ...list]);
    }

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        console.log(file);

        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    setUserListCSV(result.data);
                },
                header: true,
            });
        }
    };

    const addUser = async (event) => {
        event.preventDefault();

        if (userListCSV != "" && userListCSV != null) {
            let reponse = ""
            const arrayLength = userListCSV.length - 1;
            for (var i = 0; i < arrayLength; i++) {
                const obj = {
                    company_id: companyId,
                    name: userListCSV[i].name,
                    designation: userListCSV[i].designation,
                    email: userListCSV[i].email,
                    contact: userListCSV[i].contact,
                    dob: moment(userListCSV[i].dob).format("YYYY-MM-DD"),
                    gender: userListCSV[i].gender,
                    aadhar_no: userListCSV[i].aadhar_no,
                    pan_no: userListCSV[i].pan_no,
                    password: userListCSV[i].password,
                }

                reponse = await CreateUser(obj);
            }
            /* userListCSV.map(async (userDetails, index) => {
                 const obj = {
                     company_id: companyId,
                     name: userDetails.name,
                     designation: userDetails.designation,
                     email: userDetails.email,
                     contact: userDetails.contact,
                     dob: moment(userDetails.dob).format("YYYY-MM-DD"),
                     gender: userDetails.gender,
                     aadhar_no: userDetails.aadhar_no,
                     pan_no: userDetails.pan_no,
                     password: userDetails.password,
                 }
 
                 reponse = await CreateUser(obj);
             }); */

            if (reponse.status == true && reponse.data.data.affectedRows == 1) {
                router.push('/admin/manage-users');
            } else {
                setErrorMsg(reponse.message);
            }
        } else {
            setErrorMsg("Please Enter All Details");
        }
    }

    return (
        <div className='main-wrapper'>
            <CompanySidebar sidemenu={`${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`} />
            <div className='rightside'>
                <CompanyHeader clickEvent={() => { setSidebarVisible(!isSidebarVisible); }} sidebarVisible={isSidebarVisible} />
                <section className="mx-auto w-full">
                    <BreadCrum breadcumr1={"Manage Employee"} breadcumr1_link={"/admin/manage-users"} breadcumr2={"Upload Employee CSV"} button_name={"Employee List"} button_link={"/admin/manage-users"} />
                    {
                        (errorMsg != "" && errorMsg != null) ?
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3" role="alert">
                                <span className="block sm:inline">{errorMsg}</span>
                            </div>
                            : ""
                    }
                    <div className="mt-3">
                        <div className='card'>
                            <div className='card-header bg-white p-3 pb-4 border'>
                                <div className='flex justify-between'>
                                    <h3 className='font-bold'>Upload Employee CSV</h3>

                                    <Link href={"/sample-user.csv"} download={true} className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                                        Download Sample CSV
                                    </Link>
                                </div>
                            </div>
                            <div className='card-body bg-white py-2'>
                                <form onSubmit={addUser} method='post' autoComplete='off' >
                                    <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
                                        <div className="w-full">
                                            <div className="label">
                                                <span className="label-text">Company List</span>
                                            </div>
                                            <select className="input input-bordered w-full" name='company' onChange={(e) => { setCompanyId(e.target.value); }} required={true} value={companyId} >
                                                <option value="" disabled selected>Select Company</option>
                                                {
                                                    companyList?.map((company, index) => {
                                                        return <>
                                                            <option value={company.id} key={index} >
                                                                {company.name}
                                                            </option>
                                                        </>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="w-full">
                                            <div className="label">
                                                <span className="label-text">Employee List CSV</span>
                                            </div>
                                            <input type="file" placeholder="Employee Name" className="input input-bordered w-full p-2" name='name' required={true} accept=".csv" onChange={handleFileChange} />
                                        </div>
                                    </div>
                                    <div className="gap-4 grid sm:grid-cols-2 md:grid-cols-1 mt-5">
                                        <div className="w-full flex text-center">
                                            <button type='submit' className='btn web-btn text-white sm:mt-0 md:mt-4'>
                                                Upload Employee CSV
                                            </button>
                                            <button type='reset' className='btn btn-warning mx-5 px-8 sm:mt-0 md:mt-4'>
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
};

export default UploadCSV;