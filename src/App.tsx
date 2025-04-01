import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '@/FldrPages/login'
import Register from '@/FldrPages/register'
import Layout from '@/FldrPages/FldrLayout/layout'
import Dashboard from "@/FldrPages/FldrDashboard/dashboard"
import Schedules from "@/FldrPages/FldrSchedules/schedule"
import Course from "@/FldrPages/FldrEntry/course"
import Student from "./FldrPages/FldrEntry/student"
import Rate from "./FldrPages/FldrEntry/rate"
import Enrollment1 from "./FldrPages/FldrEnrollment/enrollment1"
import Enrollment2 from "./FldrPages/FldrEnrollment/enrollment2"
import Unauthorized from "@/FldrPages/redirects/unauthorized"
import RateCourse from "@/FldrPages/FldrEntry/ratecourse"
import Application from "./FldrPages/FldrStudent/application/application"
import Grades from "./FldrPages/FldrStudent/grades"
import StudentProfile from "./FldrPages/FldrStudent/profile"
import StatementOfAccount from "./FldrPages/FldrStudent/statement-of-account"
import Users from "./FldrPages/FldrPermissions/users"
import GrantPermission from "./FldrPages/FldrPermissions/assign-permission"
import RoutePage from "./FldrPages/FldrPermissions/routes"
import Subject from "./FldrPages/FldrEntry/subject-prerequisite"
import AcademicYearPage from "./FldrPages/FldrEntry/academicyear"
import RoutesPage from "./FldrPages/FldrPermissions/assign-permission"
import { useEffect } from "react";

const useTabVisibility = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "B4l1K n@ b@bY! 😢";
      } else {
        document.title = "Enrollment System";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

function App() {
  useTabVisibility()

  return (
    <div className="font-inter">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="entry/course" element={<Course />} />
            <Route path="entry/student" element={<Student />} />
            <Route path="entry/rate" element={<Rate />} />
            <Route path="entry/subject-prerequisite" element={<Subject />} />
            <Route path="entry/ratecourse" element={<RateCourse />} />
            <Route path="entry/AY" element={<AcademicYearPage />} />
            <Route path="enrollment/enrollment1" element={<Enrollment1 />} />
            <Route path="enrollment/enrollment2" element={<Enrollment2 />} />
            <Route path="student/application" element={<Application />} />
            <Route path="student/grades" element={<Grades />} />
            <Route path="student/profile" element={<StudentProfile />} />
            <Route path="student/statement-of-account" element={<StatementOfAccount />} />
            <Route path="permissions/users" element={<Users />} />
            <Route path="permissions/grant-permission" element={<GrantPermission />} />
            <Route path="permissions/routes" element={<RoutePage />} />
          </Route>
          <Route path="/unauthorize" element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
