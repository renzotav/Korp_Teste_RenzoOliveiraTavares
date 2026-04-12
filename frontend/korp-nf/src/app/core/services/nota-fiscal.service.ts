import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../models/nota-fiscal.model';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private apiUrl = 'http://localhost:5199/api/notasfiscais';

  constructor(private http: HttpClient) {}

  listar(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<NotaFiscal> {
    return this.http.get<NotaFiscal>(`${this.apiUrl}/${id}`);
  }

  criar(nota: NotaFiscal): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.apiUrl, nota);
  }

  imprimir(id: number, idempotencyKey: string): Observable<NotaFiscal> {
  return this.http.post<NotaFiscal>(
    `${this.apiUrl}/${id}/imprimir`,
    {},
    { headers: { 'Idempotency-Key': idempotencyKey } }
  );
}

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}