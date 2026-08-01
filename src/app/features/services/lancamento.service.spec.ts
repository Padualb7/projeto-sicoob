import { TestBed } from '@angular/core/testing';
import { LancamentoService } from './lancamento.service';
import { Lancamento } from '../models/lancamento.model';

describe('LancamentoService', () => {
  let service: LancamentoService;

  const mockLancamento: Lancamento = {
    id: 1,
    contaCorrente: '12345-6',
    titular: 'João Silva',
    valor: 100.50,
    historico: 'Lançamento Manual',
    estorno: false,
    documento: 'DOC-123',
    descricao: 'Teste',
    situacao: 'Pendente',
    pa: '001',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LancamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the same lancamento passed', (done) => {
    service.incluirLancamento(mockLancamento).subscribe((result) => {
      expect(result).toEqual(mockLancamento);
      done();
    });
  });

  it('should return observable with correct type', (done) => {
    service.incluirLancamento(mockLancamento).subscribe((result) => {
      expect(result.id).toBe(1);
      expect(result.contaCorrente).toBe('12345-6');
      expect(result.valor).toBe(100.50);
      done();
    });
  });

  it('should emit after 1500ms delay', (done) => {
    const startTime = Date.now();

    service.incluirLancamento(mockLancamento).subscribe(() => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(1500);
      done();
    });
  });

  it('should handle multiple lancamento inclusions', (done) => {
    const lancamento1 = { ...mockLancamento, id: 1 };
    const lancamento2 = { ...mockLancamento, id: 2 };

    let completed = 0;

    service.incluirLancamento(lancamento1).subscribe((result) => {
      expect(result.id).toBe(1);
      completed++;
      if (completed === 2) done();
    });

    service.incluirLancamento(lancamento2).subscribe((result) => {
      expect(result.id).toBe(2);
      completed++;
      if (completed === 2) done();
    });
  });
});
