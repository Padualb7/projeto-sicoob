import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { Lancamento } from '../models/lancamento.model';

@Injectable({
  providedIn: 'root',
})
export class LancamentoService {
  incluirLancamento(
    lancamento: Lancamento
  ): Observable<Lancamento> {
    return of(lancamento).pipe(
      delay(1500)
    );
  }
}