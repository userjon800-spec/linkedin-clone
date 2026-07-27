export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  company: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[]
  role: 'user' | 'admin' | 'company';
  backgroundImage: string
}
export interface IExperience {
  _id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
}
export interface IEducation{
  _id: string;
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
}