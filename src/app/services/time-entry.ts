import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimeEntry } from '../models/time-entry';
import { EmployeeTotal } from '../models/employee-total';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TimeEntryService {
    private readonly http = inject(HttpClient);

    getTimeEntries(){
        return this.http.get<TimeEntry[]>(environment.apiBaseUrl,{
            params:{code:environment.apiKey}
        })
    }

    calculateTotals(entries: TimeEntry[]): EmployeeTotal[] {
        const totals = new Map<string, number>();

        for (const entry of entries){
            const  name = entry.EmployeeName;
            if(entry.DeletedOn !== null || !name?.trim()){
                continue;
            }

            const start = new Date(entry.StarTimeUtc).getTime();
            const end = new Date(entry.EndTimeUtc).getTime();

            if(!Number.isFinite(start) || !Number.isFinite(end) || end<start){
                continue;
            }

            const hours = (end - start)/3_600_000;
            totals.set(name,(totals.get(name) ?? 0)+hours);
        }

        return Array.from(totals, ([employeeName, totalHours]) => ({
            employeeName,
            totalHours,
        })).sort((a, b) => b.totalHours - a.totalHours);
    }
}
