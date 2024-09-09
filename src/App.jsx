import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./utils/socket";
// const Login = lazy(() => import("./pages/Login"));
import Login from "./pages/Login";
// const Home = lazy(() => import("./pages/Home"));
import Home from "./pages/Home";
// const Chat = lazy(() => import("./pages/Chat"));
import Chat from "./pages/Chat";
// const Groups = lazy(() => import("./pages/Groups"));
import Groups from "./pages/Groups";
// const NotFound = lazy(() => import("./pages/NotFound"));
import NotFound from "./pages/NotFound";
// const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
import AdminLogin from "./pages/admin/AdminLogin";
// const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
import Dashboard from "./pages/admin/Dashboard";
// const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
import UserManagement from "./pages/admin/UserManagement";
// const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
import ChatManagement from "./pages/admin/ChatManagement";
// const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));
import MessageManagement from "./pages/admin/MessageManagement";

// const Voice = lazy(() => import("./pages/Voice"));
// const Video = lazy(() => import("./pages/Video"));

function App() {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <>
      <BrowserRouter>
        <Suspense fallback={<LayoutLoader />}>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              {/* <Route path="/voice" element={<Voice />} />
              <Route path="/video" element={<Video />} /> */}
              <Route path="/groups" element={<Groups />} />
            </Route>
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/user" element={<UserManagement />} />
            <Route path="/admin/chats" element={<ChatManagement />} />
            <Route path="/admin/messages" element={<MessageManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </>
  );
}

export default App;
