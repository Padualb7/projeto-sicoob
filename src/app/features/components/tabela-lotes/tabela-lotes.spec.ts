import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLotesComponent } from './tabela-lotes';
import { Lote } from '../../models/lote.model';

describe('TabelaLotesComponent', () => {
  let component: TabelaLotesComponent;
  let fixture: ComponentFixture<TabelaLotesComponent>;

  const mockLotes: readonly Lote[] = [
    {
      id: 1,
      dataEntrada: new Date('2026-01-01'),
      valor: 100,
      quantidadeLancamentos: 1,
      usuarioRegistro: 'user1',
      usuarioAprovacao: null,
      situacao: 'Aberto',
      dataHoraSituacao: new Date('2026-01-02'),
    },
    {
      id: 2,
      dataEntrada: new Date('2026-01-03'),
      valor: 200,
      quantidadeLancamentos: 2,
      usuarioRegistro: 'user2',
      usuarioAprovacao: 'aprovador',
      situacao: 'Confirmado',
      dataHoraSituacao: new Date('2026-01-04'),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaLotesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lotes', []);
    fixture.componentRef.setInput('paginaAtual', 1);
    fixture.componentRef.setInput('totalRegistros', 0);
    fixture.componentRef.setInput('tamanhoPagina', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute total pages correctly', () => {
    fixture.componentRef.setInput('totalRegistros', 25);
    fixture.componentRef.setInput('tamanhoPagina', 10);

    expect(component.totalPaginas()).toBe(3);
  });

  it('should toggle selection and emit selected lotes', () => {
    fixture.componentRef.setInput('lotes', mockLotes);
    const emitSpy = spyOn(component.selecaoAlterada, 'emit');

    component.alternarSelecao(mockLotes[0]);

    expect(component.idsSelecionados().has(1)).toBeTrue();
    expect(emitSpy).toHaveBeenCalledWith([mockLotes[0]]);
  });

  it('should select and deselect all lotes', () => {
    fixture.componentRef.setInput('lotes', mockLotes);
    const emitSpy = spyOn(component.selecaoAlterada, 'emit');

    component.alternarTodos();
    expect(component.todosSelecionados()).toBeTrue();
    expect(emitSpy).toHaveBeenCalled();

    component.alternarTodos();
    expect(component.todosSelecionados()).toBeFalse();
  });

  it('should emit valid page changes and clear selection', () => {
    const emitSpy = spyOn(component.paginaAlterada, 'emit');
    fixture.componentRef.setInput('totalRegistros', 20);
    fixture.componentRef.setInput('tamanhoPagina', 10);
    component.idsSelecionados.set(new Set([1]));

    component.irParaPagina(2);

    expect(emitSpy).toHaveBeenCalledWith(2);
    expect(component.idsSelecionados().size).toBe(0);
  });

  it('should not emit page change when page is invalid', () => {
    const emitSpy = spyOn(component.paginaAlterada, 'emit');
    fixture.componentRef.setInput('totalRegistros', 10);
    fixture.componentRef.setInput('tamanhoPagina', 10);

    component.irParaPagina(1);
    component.irParaPagina(0);
    component.irParaPagina(100);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
