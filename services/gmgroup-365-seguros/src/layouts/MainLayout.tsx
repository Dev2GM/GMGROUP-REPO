import React, { useEffect } from "react";
import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import API from "@/api/api";

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await API.post("/api/auth/verify", {
          token: localStorage.getItem("token")
        })
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      // console.log("verify")
      // verify();
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
