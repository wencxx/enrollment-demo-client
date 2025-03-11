import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '@/FldrPages/login'
import Register from '@/FldrPages/register'
import Layout from '@/FldrPages/FldrLayout/layout'
import Dashboard from "@/FldrPages/FldrDashboard/dashboard"
import Course from "@/FldrPages/FldrEntry/course"
import Student from "./FldrPages/FldrEntry/student"
import Rate from "./FldrPages/FldrEntry/rate"
import Enrollment1 from "@/FldrPages/FldrEntry/enrollment1"
import Unauhtorize from "@/FldrPages/redirects/unauthorized"
import RateCourse from "@/FldrPages/FldrEntry/ratecourse"

function App() {

  return (
    <div className="font-inter">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="entry/course" element={<Course />} />
            <Route path="entry/student" element={<Student />} />
            <Route path="entry/rate" element={<Rate />} />
            <Route path="entry/ratecourse" element={<RateCourse />} />
            <Route path="enrollment/enrollment1" element={<Enrollment1 />} />
          </Route>
          <Route path="/unauthorize" element={<Unauhtorize />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
