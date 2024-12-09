import { Header } from "./components/Header/Header.tsx";
import MainScreen from "./components/Main/MainScreen.tsx";
import { AuthProvider } from "./components/Auth/AuthProvider.tsx";
import Login from "./components/Auth/Login.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Auth/ProtectedRouter.tsx";
import Logout from "./components/Auth/Logout.tsx";
import GroupScreen from "./components/Group/GroupScreen.tsx";
import TeacherScreen from "./components/Teacher/TeacherScreen.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>}/>
                    <Route path="/groups" element={<GroupScreen />} />
                    <Route path="/teachers" element={<TeacherScreen />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
