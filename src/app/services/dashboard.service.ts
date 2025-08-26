import { environment } from './../../environments/environments';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardCardDTO,
  DashboardFilterDTO,
  DashboardTableRowDTO,
  DashboardChartDTO,
  DashboardDataDTO
} from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl; // URL da sua API

  constructor(private http: HttpClient, private zone: NgZone) {}

    // 🔹 SSE: Stream contínuo de dados
  getDashboardStream(): Observable<DashboardDataDTO> {
    return new Observable(observer => {
      const eventSource = new EventSource(`${this.apiUrl}/stream`);

      eventSource.onmessage = (event) => {
        // ⚠️ Importante: usar NgZone para atualizar o Angular corretamente
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

        eventSource.onerror = (error) => {
        this.zone.run(() => {
          observer.error(error);
        });
        eventSource.close();
      };

            return () => {
        eventSource.close();
      };
    });
  }

    getDashboardWithFilters(filters: any): Observable<DashboardDataDTO> {
    return this.http.get<DashboardDataDTO>(`${this.apiUrl}/dashboard`, { params: filters });
  }

      getDashboard(): Observable<DashboardDataDTO> {
    return this.http.get<DashboardDataDTO>(`${this.apiUrl}/dashboard`);
  }


}
