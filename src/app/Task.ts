export interface Task {
  id?: number;
  text: string;
  day: string;
  reminder: boolean;
  title: string,
  division: string,
  project_owner: string,
  budget: number,
  status: string,
  created: Date,
  modified: Date
}
