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
import Unauhtorize from "@/FldrPages/redirects/unauthorized"
import RateCourse from "@/FldrPages/FldrEntry/ratecourse"
import Application from "./FldrPages/FldrStudent/application/application"
import Grades from "./FldrPages/FldrStudent/grades"
import StudenPofile from "./FldrPages/FldrStudent/profile"
import StatementOfAccount from "./FldrPages/FldrStudent/statement-of-account"
import Users from "./FldrPages/FldrPermissions/users"
import RoutesPage from "./FldrPages/FldrPermissions/routes"

function App() {

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
            <Route path="entry/ratecourse" element={<RateCourse />} />
            <Route path="enrollment/enrollment1" element={<Enrollment1 />} />
            <Route path="enrollment/enrollment2" element={<Enrollment2 />} />
            <Route path="student/application" element={<Application />} />
            <Route path="student/grades" element={<Grades />} />
            <Route path="student/profile" element={<StudenPofile />} />
            <Route path="student/statement-of-account" element={<StatementOfAccount />} />
            <Route path="permissions/users" element={<Users />} />
            <Route path="permissions/routes" element={<RoutesPage />} />
          </Route>
          <Route path="/unauthorize" element={<Unauhtorize />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
