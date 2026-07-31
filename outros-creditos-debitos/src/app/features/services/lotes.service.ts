import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { FiltrosLote } from '../models/filtros-lote.model';
import { Lote } from '../models/lote.model';

@Injectable({
  providedIn: 'root',
})
export class LotesService {
  private lotesMock: readonly Lote[] = [
    {
      id: 1,
      dataEntrada: new Date('2026-01-16T00:00:00'),
      valor: 1000,
      quantidadeLancamentos: 1,
      usuarioRegistro: 'gmsv0602_00',
      usuarioAprovacao: null,
      situacao: 'Aberto',
      dataHoraSituacao: new Date('2026-01-27T13:53:11'),
    },
    {
      id: 2,
      dataEntrada: new Date('2026-01-17T00:00:00'),
      valor: 2500,
      quantidadeLancamentos: 3,
      usuarioRegistro: 'usuario02',
      usuarioAprovacao: 'aprovador01',
      situacao: 'Confirmado',
      dataHoraSituacao: new Date('2026-01-28T09:30:00'),
    },
  ];

  buscarLotes(
    filtros: FiltrosLote,
    pagina: number
  ): Observable<readonly Lote[]> {
    const lotesFiltrados = this.filtrarLotes(filtros);

    return of(lotesFiltrados).pipe(
      delay(3000)
    );
  }

  excluirLote(id: number): Observable<void> {
  this.lotesMock = this.lotesMock.filter(
    (lote) => lote.id !== id
  );

  return of(void 0).pipe(
    delay(1000)
  );
}

private filtrarLotes(
  filtros: FiltrosLote
): readonly Lote[] {
  const dataInicial = filtros.dataEntradaInicial
    ? new Date(`${filtros.dataEntradaInicial}T00:00:00`).getTime()
    : null;

  const dataFinal = filtros.dataEntradaFinal
    ? new Date(`${filtros.dataEntradaFinal}T23:59:59.999`).getTime()
    : null;

  return this.lotesMock.filter((lote) => {
    const dataFiltrada = new Date(lote.dataHoraSituacao).getTime();

    return (
      (filtros.situacao == null ||
        lote.situacao.trim().toLowerCase() ===
          filtros.situacao.trim().toLowerCase()) &&

      (filtros.idInicial == null ||
        lote.id >= filtros.idInicial) &&

      (filtros.idFinal == null ||
        lote.id <= filtros.idFinal) &&

      (filtros.valorInicial == null ||
        lote.valor >= filtros.valorInicial) &&

      (filtros.valorFinal == null ||
        lote.valor <= filtros.valorFinal) &&

      (dataInicial == null ||
        dataFiltrada >= dataInicial) &&

      (dataFinal == null ||
        dataFiltrada <= dataFinal)
    );
  });
}
}