import { Header } from "./components/Header/Header.tsx";
import { AuthProvider } from "./components/Auth/Context/AuthProvider.tsx";
import Login from "./components/Auth/Login/Login.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Routers/ProtectedRouter.tsx";
import Logout from "./components/Auth/Logout/Logout.tsx";
import GroupScreen from "./components/Schedule/Group/GroupScreen.tsx";
import TeacherScreen from "./components/Schedule/Teacher/TeacherScreen.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>}/>
                    <Route path="/group" element={<GroupScreen />} />
                    <Route path="/group/:groupUuid" element={<GroupScreen />} />
                    <Route path="/teacher" element={<TeacherScreen />} />
                    <Route path="/teacher/:teacherUuid" element={<TeacherScreen />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
