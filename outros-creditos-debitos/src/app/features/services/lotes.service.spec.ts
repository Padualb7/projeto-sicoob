import { TestBed } from '@angular/core/testing';
import { LotesService } from './lotes.service';
import { Lote } from '../models/lote.model';
import { FiltrosLote } from '../models/filtros-lote.model';
import { SituacaoLote } from '../models/situacao-lote.enum';

describe('LotesService', () => {
  let service: LotesService;

  const mockLote: Lote = {
    id: 1,
    dataEntrada: new Date('2026-01-16T00:00:00'),
    valor: 1000,
    quantidadeLancamentos: 1,
    usuarioRegistro: 'user01',
    usuarioAprovacao: null,
    situacao: 'Aberto',
    dataHoraSituacao: new Date('2026-01-27T13:53:11'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return lotes from buscarLotes', (done) => {
    const filtros: FiltrosLote = {
      instituicaoResponsavel: null,
      instituicao: null,
      situacao: null,
      idInicial: null,
      idFinal: null,
      valorInicial: null,
      valorFinal: null,
      dataEntradaInicial: null,
      dataEntradaFinal: null,
    };

    service.buscarLotes(filtros, 1).subscribe((lotes) => {
      expect(lotes.length).toBeGreaterThan(0);
      expect(lotes[0].id).toBeTruthy();
      expect(lotes[0].valor).toBeTruthy();
      done();
    });
  });

  it('should emit lotes after 3000ms delay', (done) => {
    const filtros: FiltrosLote = {
      instituicaoResponsavel: null,
      instituicao: null,
      situacao: null,
      idInicial: null,
      idFinal: null,
      valorInicial: null,
      valorFinal: null,
      dataEntradaInicial: null,
      dataEntradaFinal: null,
    };

    const startTime = Date.now();

    service.buscarLotes(filtros, 1).subscribe(() => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(3000);
      done();
    });
  });

  it('should filter lotes by situation', (done) => {
    const filtros: FiltrosLote = {
      instituicaoResponsavel: null,
      instituicao: null,
      situacao: SituacaoLote.ABERTO,
      idInicial: null,
      idFinal: null,
      valorInicial: null,
      valorFinal: null,
      dataEntradaInicial: null,
      dataEntradaFinal: null,
    };

    service.buscarLotes(filtros, 1).subscribe((lotes) => {
      lotes.forEach((lote) => {
        expect(lote.situacao.trim().toLowerCase()).toContain('aberto');
      });
      done();
    });
  });

  it('should filter lotes by ID range', (done) => {
    const filtros: FiltrosLote = {
      instituicaoResponsavel: null,
      instituicao: null,
      situacao: null,
      idInicial: 1,
      idFinal: 5,
      valorInicial: null,
      valorFinal: null,
      dataEntradaInicial: null,
      dataEntradaFinal: null,
    };

    service.buscarLotes(filtros, 1).subscribe((lotes) => {
      lotes.forEach((lote) => {
        expect(lote.id).toBeGreaterThanOrEqual(1);
        expect(lote.id).toBeLessThanOrEqual(5);
      });
      done();
    });
  });

  it('should exclude lote after excluirLote', (done) => {
    const startTime = Date.now();

    service.excluirLote(1).subscribe(() => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(1000);
      done();
    });
  });
});
