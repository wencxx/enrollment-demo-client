import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '@/FldrPages/login'
import Register from '@/FldrPages/register'
import Layout from '@/FldrPages/FldrLayout/layout'
import Dashboard from "@/FldrPages/FldrDashboard/dashboard"
import Rate from "@/FldrPages/FldrEntry/rate"
import Course from "@/FldrPages/FldrEntry/course"

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
            <Route path="entry/rate" element={<Rate />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
