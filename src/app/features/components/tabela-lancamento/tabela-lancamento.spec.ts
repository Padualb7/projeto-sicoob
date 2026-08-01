import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLancamentoComponent } from './tabela-lancamento';
import { Lancamento } from '../../models/lancamento.model';

describe('TabelaLancamentoComponent', () => {
  let component: TabelaLancamentoComponent;
  let fixture: ComponentFixture<TabelaLancamentoComponent>;

  const mockLancamento: Lancamento = {
    id: 1,
    contaCorrente: '12345-6',
    titular: 'João',
    valor: 100,
    historico: 'Lançamento Manual',
    estorno: false,
    documento: 'DOC-123',
    descricao: 'Teste',
    situacao: 'Pendente',
    pa: '001',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLancamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaLancamentoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lancamentos', []);
    fixture.componentRef.setInput('lancamentoSelecionado', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return selected state correctly', () => {
    fixture.componentRef.setInput('lancamentoSelecionado', mockLancamento);

    expect(component.estaSelecionado(mockLancamento)).toBeTrue();
    expect(component.estaSelecionado({ ...mockLancamento, id: 2 })).toBeFalse();
  });

  it('should emit selected lancamento', () => {
    const emitSpy = spyOn(component.selecaoAlterada, 'emit');

    component.selecionarLancamento(mockLancamento);

    expect(emitSpy).toHaveBeenCalledWith(mockLancamento);
  });

  it('should emit null when selecting the same lancamento again', () => {
    fixture.componentRef.setInput('lancamentoSelecionado', mockLancamento);
    const emitSpy = spyOn(component.selecaoAlterada, 'emit');

    component.selecionarLancamento(mockLancamento);

    expect(emitSpy).toHaveBeenCalledWith(null);
  });
});
