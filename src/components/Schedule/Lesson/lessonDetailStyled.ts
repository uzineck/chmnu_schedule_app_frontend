import styled from 'styled-components';
import {LessonType} from "../../../models/enums/LessonType.ts";

// Main lesson container
export const LessonDetailsContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Lesson type container (Lecture, Practice)
export const LessonTypeContainer = styled.div<{ type: string }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  color: white;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  background-color: ${(props) => {
    if (props.type === LessonType.LECTURE) return "#5c6bc0";
    if (props.type === LessonType.PRACTICE) return "#800080";
    return "#ccc";
}};
`;

// Lesson title
export const LessonTitle = styled.div`
  font-size: 0.91rem;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

// Room information
export const LessonRoom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #444;
`;

// Teacher information
export const LessonTeacher = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #444;
  
  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: #7f00ff;
    text-decoration: none;
  }
`;

// Groups information
export const LessonGroups = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.95rem;
  color: #666;
  
  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: #7f00ff;
    text-decoration: none;
  }
`;

// Actions (Edit/Delete buttons)
export const LessonActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const Icon = styled.svg<{ size?: string, color?: string }>`
  cursor: pointer;
  font-size: ${(props) => props.size || '1.1rem'};
  margin-right: 0;
  vertical-align: center;
  color: ${(props) => props.color || '#888'};
  flex-shrink: 0;

  &:hover {
    color: #7f00ff;
  }
`;
