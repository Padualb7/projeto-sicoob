import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalInclusaoLancamentoComponent } from './modal-inclusao-lancamento';
import { ContaCorrenteService } from '../../services/conta-corrente.service';
import { LancamentoService } from '../../services/lancamento.service';
import { of, throwError } from 'rxjs';
import { Lancamento } from '../../models/lancamento.model';
import { ContaCorrente } from '../../models/conta-corrente.model';

describe('ModalInclusaoLancamentoComponent', () => {
  let component: ModalInclusaoLancamentoComponent;
  let fixture: ComponentFixture<ModalInclusaoLancamentoComponent>;
  let contaCorrenteService: jasmine.SpyObj<ContaCorrenteService>;
  let lancamentoService: jasmine.SpyObj<LancamentoService>;

  const mockLancamento: Lancamento = {
    id: 1,
    contaCorrente: '12345-6',
    titular: 'João Silva',
    valor: 100,
    historico: 'Lançamento Manual',
    estorno: false,
    documento: 'DOC-123',
    descricao: 'Teste',
    situacao: 'Pendente',
    pa: '001',
  };

  const mockContaCorrente: ContaCorrente = {
    numeroConta: '12345-6',
    titular: 'João Silva',
  };

  beforeEach(async () => {
    const contaCorrenteServiceSpy = jasmine.createSpyObj('ContaCorrenteService', ['buscarConta']);
    const lancamentoServiceSpy = jasmine.createSpyObj('LancamentoService', ['incluirLancamento']);

    await TestBed.configureTestingModule({
      imports: [ModalInclusaoLancamentoComponent],
      providers: [
        { provide: ContaCorrenteService, useValue: contaCorrenteServiceSpy },
        { provide: LancamentoService, useValue: lancamentoServiceSpy },
      ],
    }).compileComponents();

    contaCorrenteService = TestBed.inject(ContaCorrenteService) as jasmine.SpyObj<ContaCorrenteService>;
    lancamentoService = TestBed.inject(LancamentoService) as jasmine.SpyObj<LancamentoService>;

    fixture = TestBed.createComponent(ModalInclusaoLancamentoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('aberto', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct controls', () => {
    expect(component.formulario.get('contaCorrente')).toBeTruthy();
    expect(component.formulario.get('valor')).toBeTruthy();
    expect(component.formulario.get('historico')).toBeTruthy();
    expect(component.formulario.get('estorno')).toBeTruthy();
    expect(component.formulario.get('documento')).toBeTruthy();
    expect(component.formulario.get('descricao')).toBeTruthy();
    expect(component.formulario.get('situacao')).toBeTruthy();
    expect(component.formulario.get('pa')).toBeTruthy();
  });

  it('should search for account and set titular', (done) => {
    contaCorrenteService.buscarConta.and.returnValue(of(mockContaCorrente));
    component.formulario.get('contaCorrente')?.setValue('12345-6');

    component.buscarConta();

    setTimeout(() => {
      expect(contaCorrenteService.buscarConta).toHaveBeenCalledWith('12345-6');
      expect(component.titularEncontrado).toBe('João Silva');
      done();
    }, 1100);
  });

  it('should handle search error and set error message', (done) => {
    contaCorrenteService.buscarConta.and.returnValue(throwError(() => new Error('Conta não encontrada')));
    component.formulario.get('contaCorrente')?.setValue('99999-9');

    component.buscarConta();

    setTimeout(() => {
      expect(component.formulario.get('contaCorrente')?.getError('erroConsulta')).toBeTruthy();
      done();
    }, 1100);
  });

  it('should not search if already loading', () => {
    component.carregando.set(true);
    component.buscarConta();
    expect(contaCorrenteService.buscarConta).not.toHaveBeenCalled();
  });

  it('should select lancamento when not visualizing or editing', () => {
    component.selecionarLancamento(mockLancamento);
    expect(component.lancamentoSelecionado()).toEqual(mockLancamento);
  });

  it('should not select lancamento if visualizing', () => {
    component.visualizando.set(true);
    component.selecionarLancamento(mockLancamento);
    expect(component.lancamentoSelecionado()).toBeNull();
  });

  it('should not select lancamento if editing', () => {
    component.editando.set(true);
    component.selecionarLancamento(mockLancamento);
    expect(component.lancamentoSelecionado()).toBeNull();
  });

  it('should emit fechar event', () => {
    const emitSpy = spyOn(component.fechar, 'emit');
    component.fechar.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should calculate possuiLancamentoSelecionado correctly', () => {
    expect(component.possuiLancamentoSelecionado()).toBeFalse();

    component.lancamentoSelecionado.set(mockLancamento);
    expect(component.possuiLancamentoSelecionado()).toBeTrue();

    component.lancamentoSelecionado.set(null);
    expect(component.possuiLancamentoSelecionado()).toBeFalse();
  });
});
