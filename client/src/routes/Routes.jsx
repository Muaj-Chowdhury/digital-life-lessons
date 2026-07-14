import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../layouts/Dashboard";
import Upgrade from "../pages/Payment/Upgrade";
import AddLesson from "../pages/dashboard/AddLesson/AddLesson";
import MyLesson from "../pages/dashboard/MyLesson/MyLesson";
import PublicLessons from "../pages/PublicLessons/PublicLessons";
import LessonDetails from "../pages/PublicLessons/LessonDetails";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PrivateRoute from "./PrivateRoute";
import MyFavorites from "../pages/dashboard/MyFavorites/MyFavorites";
import Profile from "../pages/dashboard/Profile/Profile";
import UserStatistics from "../component/Statistics/UserStatistics";
import ManageUsers from "../pages/dashboard/Admin/ManageUsers";
import ManageLessons from "../pages/dashboard/Admin/ManageLessons/ManageLessons";
import ReportedLessons from "../pages/dashboard/Admin/ReportedLessons/ReportedLessons";
import AdminProfile from "../pages/dashboard/Admin/AdminProfile/AdminProfile";
import AdminDashboard from "../pages/dashboard/Admin/AdminDashboard/AdminDashboard";
import AdminRoute from "./AdminRoute";
import NotFound from "../component/shared/NotFound";
import PaymentCancel from "../pages/Payment/PaymentCancel";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/public-lessons",
        element: <PublicLessons></PublicLessons>,
      },
      {
        path: "/lesson-details/:id",
        element: <LessonDetails></LessonDetails>,
      },

      {
        path: "/upgrade",
        element: (
          <PrivateRoute>
            <Upgrade></Upgrade>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess></PaymentSuccess>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-cancel",
        element: (
          <PrivateRoute>
            <PaymentCancel></PaymentCancel>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    Component: Dashboard,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <UserStatistics></UserStatistics>
          </PrivateRoute>
        ),
      },
      {
        path: "add-lesson",
        element: (
          <PrivateRoute>
            <AddLesson></AddLesson>
          </PrivateRoute>
        ),
      },
      {
        path: "my-lessons",
        element: (
          <PrivateRoute>
            <MyLesson></MyLesson>
          </PrivateRoute>
        ),
      },
      {
        path: "my-favorites",
        element: (
          <PrivateRoute>
            <MyFavorites></MyFavorites>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "admin", // Prefix for all admin routes
        children: [
          {
            index: true, // Results in /dashboard/admin/manage-users
            element: (
              <PrivateRoute>
                <AdminRoute>
                  {" "}
                  <AdminDashboard />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "manage-users", // Results in /dashboard/admin/manage-users
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "manage-lessons",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <ManageLessons />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "reported-lessons",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <ReportedLessons />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <AdminProfile />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
  // 2. CATCH-ALL ROUTE (Add this at the end)
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
