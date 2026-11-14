import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;