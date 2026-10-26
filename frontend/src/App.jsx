import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Learn from './pages/Learn.jsx';
import Notifications from './pages/Notifications.jsx';
import TeacherCourses from './pages/teacher/TeacherCourses.jsx';
import CourseEditor from './pages/teacher/CourseEditor.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages pour tout utilisateur connecté */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Étudiant */}
        <Route element={<ProtectedRoute roles={['etudiant']} />}>
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:courseId" element={<Learn />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Formateur */}
        <Route element={<ProtectedRoute roles={['formateur']} />}>
          <Route path="/teacher" element={<TeacherCourses />} />
          <Route path="/teacher/new" element={<CourseEditor />} />
          <Route path="/teacher/courses/:id" element={<CourseEditor />} />
        </Route>

        {/* Administrateur */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}
