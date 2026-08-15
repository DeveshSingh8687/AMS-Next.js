import React, { useState, useEffect } from "react";
// import { appClient } from "@/api/noClient";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Clock, Calendar, CheckCircle } from "lucide-react";
import { getCurrentPosition, getAddress } from "@/lib/location";
import PunchButton from "@/components/dashboard/PunchButton";
import moment from "moment";
// import { useAuth } from "@/hooks/useAuth";

export default function EmployeeDashboard() {
  // const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState({name:'Devesh'});
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment());
  const { toast } = useToast();
//   const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // const me = await appClient.auth.me();
    const me = 'Employee';
    // setUser(me);
    // const employees = await appClient.entities.Employee.filter({ user_id: me.id });
    const employees = [];
    const emp = employees[0] || null;
    // setEmployee(user);
    if (emp) {
      const today = moment().format("YYYY-MM-DD");
    //   const records = await appClient.entities.Attendance.filter({
    //     employee_id: emp.id,
    //     date: today,
    //   });
      const records = []
      setTodayRecord(records[0] || null);
    }
    setLoading(false);
  };

  const canPunchIn = () => {
    if (!todayRecord) return true;
    if (todayRecord.status === "present") {
      // Already punched in and out. Check 12h rule
      const punchInTime = moment(todayRecord.punch_in_time);
      return moment().diff(punchInTime, "hours") >= 12;
    }
    if (todayRecord.status === "punched_in") {
      // Currently punched in, check 12h
      const punchInTime = moment(todayRecord.punch_in_time);
      return moment().diff(punchInTime, "hours") >= 12;
    }
    return false;
  };

  const canPunchOut = () => {
    return todayRecord && todayRecord.status === "punched_in";
  };

  const getPunchInMessage = () => {
    if (!todayRecord) return null;
    if (todayRecord.status === "punched_in") {
      const punchInTime = moment(todayRecord.punch_in_time);
      const hoursLeft = 12 - moment().diff(punchInTime, "hours", true);
      if (hoursLeft > 0) {
        return `Already punched in. Please punch out first or wait ${Math.ceil(hoursLeft)}h.`;
      }
      return null;
    }
    if (todayRecord.status === "present") {
      const punchInTime = moment(todayRecord.punch_in_time);
      const hoursLeft = 12 - moment().diff(punchInTime, "hours", true);
      if (hoursLeft > 0) {
        return `Attendance complete. You can punch in again in ${Math.ceil(hoursLeft)}h.`;
      }
      return null;
    }
    return null;
  };

  const handlePunchIn = async () => {
    setPunching(true);
    try {
      const pos = await getCurrentPosition();
      const address = await getAddress(pos.lat, pos.lng);
      const now = moment();
      const data = {
        employee_id: employee.id,
        employee_name: employee.name,
        employee_code: employee.employee_id,
        department: employee.department || "",
        date: now.format("YYYY-MM-DD"),
        punch_in_time: now.toISOString(),
        punch_in_lat: pos.lat,
        punch_in_lng: pos.lng,
        punch_in_address: address,
        status: "punched_in",
      };
    //   const record = await appClient.entities.Attendance.create(data);
      const record = [];
      setTodayRecord(record);
      toast({ title: "Punched In", description: `Successfully punched in at ${now.format("hh:mm A")}` });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setPunching(false);
    }
  };

  const handlePunchOut = async () => {
    setPunching(true);
    try {
      const pos = await getCurrentPosition();
      const address = await getAddress(pos.lat, pos.lng);
      const now = moment();
      const punchIn = moment(todayRecord.punch_in_time);
      const hours = now.diff(punchIn, "hours", true);
    //   await appClient.entities.Attendance.update(todayRecord.id, {
    //     punch_out_time: now.toISOString(),
    //     punch_out_lat: pos.lat,
    //     punch_out_lng: pos.lng,
    //     punch_out_address: address,
    //     working_hours: Math.round(hours * 100) / 100,
    //     status: "present",
    //   });
      await loadData();
      toast({ title: "Punched Out", description: `Successfully punched out at ${now.format("hh:mm A")}` });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setPunching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Set Up</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Your employee profile hasn't been created yet. Please contact your admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {employee.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {currentTime.format("dddd, MMMM D, YYYY")}
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#0F766E]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentTime.format("hh:mm:ss A")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Today's Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentTime.format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              todayRecord?.status === "present"
                ? "bg-emerald-50"
                : todayRecord?.status === "punched_in"
                ? "bg-amber-50"
                : "bg-gray-50"
            }`}>
              <CheckCircle className={`w-4 h-4 ${
                todayRecord?.status === "present"
                  ? "text-emerald-600"
                  : todayRecord?.status === "punched_in"
                  ? "text-amber-600"
                  : "text-gray-400"
              }`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {todayRecord?.status === "present"
                  ? "Completed"
                  : todayRecord?.status === "punched_in"
                  ? "Punched In"
                  : "Not Punched In"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Punch Buttons */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <PunchButton
            type="in"
            onClick={handlePunchIn}
            disabled={!canPunchIn()}
            loading={punching && canPunchIn()}
            message={getPunchInMessage()}
          />
          <PunchButton
            type="out"
            onClick={handlePunchOut}
            disabled={!canPunchOut()}
            loading={punching && canPunchOut()}
            message={!canPunchOut() && !todayRecord ? "Punch in first" : null}
          />
        </div>
      </div>

      {/* Today's details */}
      {todayRecord && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Today's Attendance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Punch In</p>
              <p className="text-sm font-medium">{moment(todayRecord.punch_in_time).format("hh:mm A")}</p>
              {todayRecord.punch_in_address && (
                <p className="text-xs text-gray-500 flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                  {todayRecord.punch_in_address}
                </p>
              )}
            </div>
            {todayRecord.punch_out_time && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Punch Out</p>
                <p className="text-sm font-medium">{moment(todayRecord.punch_out_time).format("hh:mm A")}</p>
                {todayRecord.punch_out_address && (
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    {todayRecord.punch_out_address}
                  </p>
                )}
              </div>
            )}
          </div>
          {todayRecord.working_hours != null && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Working Hours</p>
              <p className="text-lg font-bold text-[#0F766E]">{todayRecord.working_hours.toFixed(2)} hrs</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}