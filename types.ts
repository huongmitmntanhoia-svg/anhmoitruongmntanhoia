
export type SchoolYearId = string;
export type GradeId = string;
export type ClassId = string;

export interface SchoolYear {
  id: SchoolYearId;
  name: string;
}

export interface Grade {
  id: GradeId;
  name: string;
  yearId: SchoolYearId;
}

export interface Class {
  id: ClassId;
  name: string;
  gradeId: GradeId;
  yearId: SchoolYearId;
}

export interface Photo {
  id: string;
  classId: ClassId;
  yearId: SchoolYearId;
  url: string;
  description: string;
  createdAt: number;
}

export enum ViewMode {
  EXPLORE = 'explore',
  STATISTICS = 'statistics',
  ADMIN = 'admin'
}
