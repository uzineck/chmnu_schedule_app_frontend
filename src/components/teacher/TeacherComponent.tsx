import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Teacher } from "../../models/teacher/Teacher";
import { getAllTeachers } from "../../api/schedule/teacher";

export const TeacherComponent: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch teachers when the component mounts
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await getAllTeachers();
                setTeachers(response.data);
            } catch (err) {
                setError("Failed to load teachers");
            }
        };
        fetchTeachers();
    }, []);

    // Handle teacher selection
    const handleTeacherSelect = (selectedOption: any) => {
        if (selectedOption) {
            navigate(`/teacher/${selectedOption.value}/lessons`);
        }
    };

    // Format options for react-select
    const teacherOptions = teachers.map((teacher) => ({
        label: `${teacher.first_name} ${teacher.last_name}`,
        value: teacher.uuid,
    }));

    // Custom styles for the react-select component
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: "black",
            color: "white",
            borderColor: "white",
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: "white",
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "white",
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: "black",
            color: "white",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? "gray" : "black",
            color: "white",
        }),
    };

    return (
        <div style={{ backgroundColor: "black", color: "white", padding: "20px", marginBottom: "20px" }}>
            <h1>TeacherComponent Search</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Select
                options={teacherOptions}
                onChange={handleTeacherSelect}
                placeholder="Search for a teacher..."
                isClearable
                styles={customStyles}
            />
        </div>
    );
};
