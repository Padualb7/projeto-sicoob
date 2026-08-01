import { Injectable } from '@angular/core';
import {
  delay,
  Observable,
  of,
} from 'rxjs';

import { ContaCorrente } from '../models/conta-corrente.model';

@Injectable({
  providedIn: 'root',
})
export class ContaCorrenteService {
  private readonly contasMock: readonly ContaCorrente[] = [
    {
      numeroConta: '12345-6',
      titular: 'João da Silva',
    },
    {
      numeroConta: '23456-7',
      titular: 'Maria Oliveira',
    },
    {
      numeroConta: '34567-8',
      titular: 'Carlos Souza',
    },
    {
      numeroConta: '45678-9',
      titular: 'Ana Paula Lima',
    },
    {
      numeroConta: '56789-0',
      titular: 'Lucas Pádua',
    },
  ];

  buscarConta(
    numeroConta: string
  ): Observable<ContaCorrente | null> {
    const conta =
      this.contasMock.find(
        (conta) =>
          conta.numeroConta === numeroConta
      ) ?? null;

    return of(conta).pipe(
      delay(1000)
    );
  }
}