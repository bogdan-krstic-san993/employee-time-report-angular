export interface TimeEntry {
  Id: string;
  EmployeeName: string | null;
  StarTimeUtc: string;
  EndTimeUtc: string;
  DeletedOn: string | null;
}