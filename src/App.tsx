import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom"
import Login from '@/FldrPages/login'
import Register from '@/FldrPages/register'
import Layout from '@/FldrPages/FldrLayout/layout'
import Dashboard from "@/FldrPages/FldrDashboard/dashboard"
import Schedules from "@/FldrPages/FldrSchedules/schedule"
import Course from "@/FldrPages/FldrEntry/course"
import Rate from "./FldrPages/FldrEntry/rate"
import Enrollment1 from "./FldrPages/FldrEnrollment/enrollment1"
import Enrollment2 from "./FldrPages/FldrEnrollment/enrollment2"
import Enrollment3 from "./FldrPages/FldrEnrollment/enrollment3"
import Unauthorized from "@/FldrPages/redirects/unauthorized"
import Application from "./FldrPages/FldrStudent/application/application"
import Grades from "./FldrPages/FldrStudent/grades"
import StudentProfile from "./FldrPages/FldrStudent/profile"
import StatementOfAccount from "./FldrPages/FldrStudent/statement-of-account"
import Users from "./FldrPages/FldrPermissions/users"
import GrantPermission from "./FldrPages/FldrPermissions/permissions-manager"
import RoutePage from "./FldrPages/FldrPermissions/routes"
// import Subject from "./FldrPages/FldrEntry/subject-prerequisite"
import AcademicYearPage from "./FldrPages/FldrEntry/academicyear"
import Professor from "./FldrPages/FldrEntry/professor"
import HighSchool from "./FldrPages/FldrEntry/highschool"
import Elementary from "./FldrPages/FldrEntry/elementary"
import EnrollDescription from "./FldrPages/FldrEntry/enrolldescription"
import Room from "./FldrPages/FldrEntry/room"
import Section from "./FldrPages/FldrEntry/section"
import Rate1 from "./FldrPages/FldrEntry/rate1"
import RateDesc from "./FldrPages/FldrEntry/ratedesc"
import Rate2 from "./FldrPages/FldrEntry/rate2"
import Students from "./FldrPages/FldrEntry/students"
import College from "./FldrPages/FldrEntry/college"
import Semester from "./FldrPages/FldrEntry/semester"
import ManageGradesPage from './FldrPages/FldrTeacher/manage-grades'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorize",
    element: <Unauthorized />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/schedules",
        element: <Schedules />,
      },
      {
        path: "/students",
        element: <Students />,
      },
      {
        path: "/entry/college",
        element: <College />,
      },
      {
        path: "/entry/course",
        element: <Course />,
      },
      {
        path: "/entry/room",
        element: <Room />,
      },
      {
        path: "/entry/section",
        element: <Section />,
      },
      // {
      //   path: "/entry/student",
      //   element: <Student />,
      // },
      {
        path: "/entry/rate",
        element: <Rate />,
      },
      // REMOVED FROM tblObjects:
      // {
      //   path: "/entry/subject-prerequisite",
      //   element: <Subject />,
      // },
      // {
      //   path: "/entry/ratecourse",
      //   element: <RateCourse />,
      // },
      {
        path: "/entry/AY",
        element: <AcademicYearPage />,
      },
      {
        path: "/entry/semester",
        element: <Semester />,
      },
      {
        path: "/entry/professors",
        element: <Professor />,
      },
      {
        path: "/entry/highschool",
        element: <HighSchool />,
      },
      {
        path: "/entry/elementary",
        element: <Elementary />,
      },
      {
        path: "/entry/rate1",
        element: <Rate1 />,
      },
      {
        path: "/entry/rate2",
        element: <Rate2 />,
      },
      {
        path: "/entry/ratedesc",
        element: <RateDesc />,
      },
      {
        path: "/entry/enroll-description",
        element: <EnrollDescription />,
      },
      {
        path: "/enrollment/admission",
        element: <Enrollment1 />,
      },
      {
        path: "/enrollment/load-subjects",
        element: <Enrollment2 />,
      },
      {
        path: "/enrollment/payments",
        element: <Enrollment3 />,
      },
      {
        path: "/student/application",
        element: <Application />,
      },
      {
        path: "/student/grades",
        element: <Grades />,
      },
      {
        path: "/student/profile",
        element: <StudentProfile />,
      },
      {
        path: "/teacher/manage-grades",
        element: <ManageGradesPage />,
      },
      {
        path: "/student/statement-of-account",
        element: <StatementOfAccount />,
      },
      {
        path: "/permissions/users",
        element: <Users />,
      },
      {
        path: "/permissions/grant-permission",
        element: <GrantPermission />,
      },
      {
        path: "/permissions/routes",
        element: <RoutePage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="font-inter">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
