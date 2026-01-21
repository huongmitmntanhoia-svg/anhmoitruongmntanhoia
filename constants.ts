
import { SchoolYear, Grade, Class } from './types';

export const SCHOOL_YEARS: SchoolYear[] = [
  { id: '2021-2022', name: 'Năm học 2021 – 2022' },
  { id: '2022-2023', name: 'Năm học 2022 – 2023' },
  { id: '2023-2024', name: 'Năm học 2023 – 2024' },
  { id: '2024-2025', name: 'Năm học 2024 – 2025' },
  { id: '2025-2026', name: 'Năm học 2025 – 2026' },
];

export const GRADES = (yearId: string): Grade[] => [
  { id: `${yearId}-5yo`, name: 'Khối 5 tuổi', yearId },
  { id: `${yearId}-4yo`, name: 'Khối 4 tuổi', yearId },
  { id: `${yearId}-3yo`, name: 'Khối 3 tuổi', yearId },
  { id: `${yearId}-toddler`, name: 'Khối Nhà trẻ', yearId },
];

const classConfig = {
  '5yo': ['A1', 'A2', 'A3', 'A4', 'A5'],
  '4yo': ['B1', 'B2', 'B3', 'B4', 'B5'],
  '3yo': ['C1', 'C2', 'C3', 'C4', 'C5'],
  'toddler': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
};

export const CLASSES = (yearId: string): Class[] => {
  const grades = GRADES(yearId);
  return grades.flatMap(grade => {
    const key = grade.id.split('-').pop() as keyof typeof classConfig;
    const names = classConfig[key] || [];
    return names.map(name => ({
      id: `${grade.id}-${name}`,
      name,
      gradeId: grade.id,
      yearId
    }));
  });
};
