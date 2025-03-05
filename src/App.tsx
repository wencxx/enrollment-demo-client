import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '@/FldrPages/login'
import Layout from '@/FldrPages/FldrLayout/layout'
import Dashboard from "@/FldrPages/FldrDashboard/dashboard"
import Rate from "@/FldrPages/FldrEntry/rate"
import Course from "@/FldrPages/FldrEntry/course"

function App() {

  return (
    <div className="font-inter">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dean" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="course" element={<Course />} />
            <Route path="rate" element={<Rate />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
