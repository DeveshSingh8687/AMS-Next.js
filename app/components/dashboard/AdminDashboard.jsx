import React, { useState, useEffect } from "react";
// import { appClient } from "@/api/noClient";
import { Users, UserCheck, Clock, UserX, ClipboardList } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import moment from "moment";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    activeNow: 0,
    yetToPunch: 0,
    totalAttendance: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // const employees = await appClient.entities.Employee.filter({ status: "active" });
    const employees = [];
    const today = moment().format("YYYY-MM-DD");
    // const todayAttendance = await appClient.entities.Attendance.filter({ date: today });
    const todayAttendance = [];

    const present = todayAttendance.filter((a) => a.status === "present").length;
    const active = todayAttendance.filter((a) => a.status === "punched_in").length;

    setStats({
      totalEmployees: employees.length,
      presentToday: present + active,
      activeNow: active,
      yetToPunch: employees.length - todayAttendance.length,
      totalAttendance: todayAttendance.length,
    });

    setRecentAttendance(todayAttendance.slice(0, 10));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {moment().format("dddd, MMMM D, YYYY")}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} color="teal" />
        <StatCard icon={UserCheck} label="Present Today" value={stats.presentToday} color="green" />
        <StatCard icon={Clock} label="Active Now" value={stats.activeNow} color="blue" />
        <StatCard icon={UserX} label="Yet to Punch" value={stats.yetToPunch} color="amber" />
        <StatCard icon={ClipboardList} label="Total Attendance" value={stats.totalAttendance} color="teal" />
      </div>

      {/* Recent attendance */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Today's Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Employee</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Punch In</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Punch Out</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Hours</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No attendance records today.
                  </td>
                </tr>
              ) : (
                recentAttendance.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.employee_name}</td>
                    <td className="px-4 py-3 text-gray-500">{r.employee_code}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {moment(r.punch_in_time).format("hh:mm A")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.punch_out_time ? moment(r.punch_out_time).format("hh:mm A") : "-"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {r.working_hours != null ? `${r.working_hours.toFixed(2)}h` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        r.status === "present" ? "bg-emerald-50 text-emerald-700" :
                        r.status === "punched_in" ? "bg-amber-50 text-amber-700" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {r.status === "punched_in" ? "In Progress" : r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}