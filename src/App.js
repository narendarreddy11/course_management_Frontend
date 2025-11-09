import { createBrowserRouter,RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Courses from "./components/Courses";
import Login from "./components/Login";
import Register from "./components/Register";
import StudentDashBoard from "./components/StudentDashBoard";
import PrivateRoute from "./components/PrivateRoute";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import EnrolledCourses from "./components/EnrolledCourses";
import ProfilePage from "./components/ProfilePage";
import UserList from "./components/UserList";
import AllCourses from "./components/AllCourses";
import Enrollments from "./components/Enrollments";
const router = createBrowserRouter([
  { 
    path: "/",
    element: <RootLayout />,
    children:[
      {path:"/",element:<Home/>},
      {path:"/Home",element:<Home/>},
      {path:"/courses",element:<Courses/>},
      {path:"/login",element:<Login/>},
      {
        path:"/register",element:<Register/>
      },
      {
          path:"/userenrolled",
           element: (
    <PrivateRoute allowedRoles={["USER"]}>
           <EnrolledCourses/>
    </PrivateRoute>
  ),

      },
      {
        path:"/profile",
        element:<ProfilePage/>

      },
      {
        path:"/admin-login",
        element:<AdminLogin/>
      },
      {
  path: "/student-dashboard",
  element: (
    <PrivateRoute allowedRoles={["USER"]}>
<StudentDashBoard/>
    </PrivateRoute>
  ),
    },
      {
  path: "/admin-dashboard",
  element: (
    <PrivateRoute allowedRoles={["ADMIN"]}>
  <AdminDashboard/>
    </PrivateRoute>
  ),
    },
    {
      path:'/admin/users',
      element:<UserList/>
    },
      {
      path:'/admin/courses',
      element:<AllCourses/>
    },
    {
      path:'/admin/enrollments',
      element:<Enrollments/>
    }

    ]
  }
]);

function App()
{     return (
<>
      <RouterProvider router={router} />
    </>
);
}
export default App;
