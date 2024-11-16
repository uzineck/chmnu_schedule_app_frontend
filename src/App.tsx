import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TeacherComponent } from "./components/teacher/TeacherComponent";
import { TeacherLessons } from "./components/teacher/TeacherLessons";

function App() {
    return (
        <Router>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                <TeacherComponent /> {/* This will always stay on top */}
                <Routes>
                    <Route path="/teacher/:uuid/lessons" element={<TeacherLessons />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
