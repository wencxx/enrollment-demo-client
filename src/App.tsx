import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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
import Enrollment3 from "./FldrPages/FldrEnrollment/enrollment3"
import Unauthorized from "@/FldrPages/redirects/unauthorized"
import RateCourse from "@/FldrPages/FldrEntry/ratecourse"
import Application from "./FldrPages/FldrStudent/application/application"
import Grades from "./FldrPages/FldrStudent/grades"
import StudentProfile from "./FldrPages/FldrStudent/profile"
import StatementOfAccount from "./FldrPages/FldrStudent/statement-of-account"
import Users from "./FldrPages/FldrPermissions/users"
import GrantPermission from "./FldrPages/FldrPermissions/permissions-manager"
import RoutePage from "./FldrPages/FldrPermissions/routes"
import Subject from "./FldrPages/FldrEntry/subject-prerequisite"
import AcademicYearPage from "./FldrPages/FldrEntry/academicyear"
import Professor from "./FldrPages/FldrEntry/professor"
import HighSchool from "./FldrPages/FldrEntry/highschool"
import Elementary from "./FldrPages/FldrEntry/elementary"
import Town from "./FldrPages/FldrEntry/town"
import EnrollDescription from "./FldrPages/FldrEntry/enrolldescription"
import Room from "./FldrPages/FldrEntry/room"
import Section from "./FldrPages/FldrEntry/section"
import Rate1 from "./FldrPages/FldrEntry/rate1"
import RateDesc from "./FldrPages/FldrEntry/ratedesc"
import Rate2 from "./FldrPages/FldrEntry/rate2"
import Students from "./FldrPages/FldrEntry/students"

const routes = [
  {
    element: <Dashboard />,
    path: '/dashboard',
  },
  {
    element: <Schedules />,
    path: '/schedules',
  },
  {
    element: <Students />,
    path: '/students',
  },
  {
    element: <Course />,
    path: '/entry/course',
  },
  {
    element: <Room />,
    path: '/entry/room',
  },
  {
    element: <Section />,
    path: '/entry/section',
  },
  {
    element: <Student />,
    path: '/entry/student',
  },
  {
    element: <Rate />,
    path: '/entry/rate',
  },
  {
    element: <Subject />,
    path: '/entry/subject-prerequisite',
  },
  {
    element: <RateCourse />,
    path: '/entry/ratecourse',
  },
  {
    element: <AcademicYearPage />,
    path: '/entry/AY',
  },
  {
    element: <Professor />,
    path: '/entry/professors',
  },
  {
    element: <HighSchool />,
    path: '/entry/highschool',
  },
  {
    element: <Elementary />,
    path: '/entry/elementary',
  },
  {
    element: <Town />,
    path: '/entry/town',
  },
  {
    element: <Rate1 />,
    path: '/entry/rate1',
  },
  {
    element: <Rate2 />,
    path: '/entry/rate2',
  },
  {
    element: <RateDesc />,
    path: '/entry/ratedesc',
  },
  {
    element: <EnrollDescription />,
    path: '/entry/enroll-description',
  },
  {
    element: <Enrollment1 />,
    path: '/enrollment/enrollment1',
  },
  {
    element: <Enrollment2 />,
    path: '/enrollment/enrollment2',
  },
  {
    element: <Enrollment3 />,
    path: '/enrollment/enrollment3',
  },
  {
    element: <Application />,
    path: '/student/application',
  },
  {
    element: <Grades />,
    path: '/student/grades',
  },
  {
    element: <StudentProfile />,
    path: '/student/profile',
  },
  {
    element: <StatementOfAccount />,
    path: '/student/statement-of-account',
  },
  {
    element: <Users />,
    path: '/permissions/users',
  },
  {
    element: <GrantPermission />,
    path: '/permissions/grant-permission',
  },
  {
    element: <RoutePage />,
    path: '/permissions/routes',
  },
]

// const useTabVisibility = () => {
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         document.title = "B4l1K n@ b@bY! 😢";
//       } else {
//         document.title = "Enrollment System";
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);
// };


function App() {

  return (
    <div className="font-inter">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
          <Route path="/unauthorize" element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
