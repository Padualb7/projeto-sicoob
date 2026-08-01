import { TestBed } from '@angular/core/testing';
import { ContaCorrenteService } from './conta-corrente.service';
import { ContaCorrente } from '../models/conta-corrente.model';

describe('ContaCorrenteService', () => {
  let service: ContaCorrenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContaCorrenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find existing account by number', (done) => {
    service.buscarConta('12345-6').subscribe((conta) => {
      expect(conta).toBeTruthy();
      expect(conta?.numeroConta).toBe('12345-6');
      expect(conta?.titular).toBe('João da Silva');
      done();
    });
  });

  it('should return null for non-existing account', (done) => {
    service.buscarConta('99999-9').subscribe((conta) => {
      expect(conta).toBeNull();
      done();
    });
  });

  it('should return different accounts correctly', (done) => {
    const expectedAccounts: { [key: string]: string } = {
      '12345-6': 'João da Silva',
      '23456-7': 'Maria Oliveira',
      '34567-8': 'Carlos Souza',
      '45678-9': 'Ana Paula Lima',
      '56789-0': 'Lucas Pádua',
    };

    let completedRequests = 0;

    Object.entries(expectedAccounts).forEach(([numConta, titular]) => {
      service.buscarConta(numConta).subscribe((conta) => {
        expect(conta?.numeroConta).toBe(numConta);
        expect(conta?.titular).toBe(titular);
        completedRequests++;

        if (completedRequests === Object.keys(expectedAccounts).length) {
          done();
        }
      });
    });
  });

  it('should emit result after delay', (done) => {
    const startTime = Date.now();

    service.buscarConta('12345-6').subscribe(() => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(1000);
      done();
    });
  });
});
