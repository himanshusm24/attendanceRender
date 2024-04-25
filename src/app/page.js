"use client"
import React, { useEffect, useState } from "react";
import Login from "@/app/auth/login/page";
import HomePage from "./home/page";
import Layout from "@/components/loader/Layout";

const Home = () => {
  const [userLogin, setUserLogin] = useState(false);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = () => {

    let user_id = localStorage.getItem('user_id');
    let user_type = localStorage.getItem('user_type');

    if (user_type == 'user' && user_id > 0) {
      setShowData(true);
      setUserLogin(true);
    } else {
      setShowData(true);
      setUserLogin(false);
    }
  };

  return (
    <>
      {/* <Layout>
        {
          (showData) ?
            <>
              {
                (userLogin) ? <HomePage /> : <Login />
              }
            </>
            :
            <></>
        }
      </Layout> */}
      {
        showData &&
        <>
          {
            (userLogin) ? <HomePage /> : <Login />
          }
        </>
      }
    </>
  )
}

export default Home;