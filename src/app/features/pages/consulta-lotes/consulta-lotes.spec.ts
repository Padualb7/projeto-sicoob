import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ConsultaLotesComponent } from './consulta-lotes';
import { LotesService } from '../../services/lotes.service';
import { FiltrosLote } from '../../models/filtros-lote.model';
import { Lote } from '../../models/lote.model';
import { ContaCorrenteService } from '../../services/conta-corrente.service';
import { LancamentoService } from '../../services/lancamento.service';

describe('ConsultaLotesComponent', () => {
  let component: ConsultaLotesComponent;
  let fixture: ComponentFixture<ConsultaLotesComponent>;
  let lotesServiceSpy: jasmine.SpyObj<LotesService>;

  const mockLotes: readonly Lote[] = [
    {
      id: 1,
      dataEntrada: new Date('2026-01-01T00:00:00'),
      valor: 1000,
      quantidadeLancamentos: 1,
      usuarioRegistro: 'user1',
      usuarioAprovacao: null,
      situacao: 'Aberto',
      dataHoraSituacao: new Date('2026-01-02T00:00:00'),
    },
    {
      id: 2,
      dataEntrada: new Date('2026-01-03T00:00:00'),
      valor: 2500,
      quantidadeLancamentos: 2,
      usuarioRegistro: 'user2',
      usuarioAprovacao: 'aprovador',
      situacao: 'Confirmado',
      dataHoraSituacao: new Date('2026-01-04T00:00:00'),
    },
  ];

  beforeEach(async () => {
    lotesServiceSpy = jasmine.createSpyObj('LotesService', [
      'buscarLotes',
      'excluirLote',
    ]);
    lotesServiceSpy.buscarLotes.and.returnValue(of(mockLotes));
    lotesServiceSpy.excluirLote.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ConsultaLotesComponent],
      providers: [
        { provide: LotesService, useValue: lotesServiceSpy },
        { provide: ContaCorrenteService, useValue: {} },
        { provide: LancamentoService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear filters when onLimparFiltros is called', () => {
    component.lotes.set(mockLotes);
    component.lotesSelecionados.set([mockLotes[0]]);
    component.paginaAtual.set(2);
    component.totalRegistros.set(2);
    component.filtrosAtuais.set({} as FiltrosLote);

    component.onLimparFiltros();

    expect(component.lotes()).toEqual([]);
    expect(component.lotesSelecionados()).toEqual([]);
    expect(component.paginaAtual()).toBe(1);
    expect(component.totalRegistros()).toBe(0);
    expect(component.filtrosAtuais()).toBeNull();
  });

  it('should search lotes and update signals', () => {
    const filtros = { situacao: null } as FiltrosLote;

    component.onPesquisar(filtros);

    expect(lotesServiceSpy.buscarLotes).toHaveBeenCalledWith(
      filtros,
      1
    );
    expect(component.lotes()).toEqual(mockLotes);
    expect(component.totalRegistros()).toBe(mockLotes.length);
    expect(component.carregando()).toBeFalse();
  });

  it('should update selected lotes on selection change', () => {
    component.onSelecaoAlterada([mockLotes[0]]);

    expect(component.lotesSelecionados()).toEqual([mockLotes[0]]);
    expect(component.possuiUmLoteSelecionado()).toBeTrue();
    expect(component.possuiLotesSelecionados()).toBeTrue();
  });

  it('should update page and clear selection on page change', () => {
    component.lotesSelecionados.set([mockLotes[0]]);

    component.onPaginaAlterada(3);

    expect(component.paginaAtual()).toBe(3);
    expect(component.lotesSelecionados()).toEqual([]);
  });

  it('should open and close the inclusion modal', () => {
    expect(component.modalInclusaoAberta).toBeFalse();

    component.onIncluir();
    expect(component.modalInclusaoAberta).toBeTrue();

    component.fecharModalInclusao();
    expect(component.modalInclusaoAberta).toBeFalse();
  });

  it('should call excluirLote and refresh lotes when a lote is selected', () => {
    const filtros = { situacao: null } as FiltrosLote;
    component.filtrosAtuais.set(filtros);
    component.lotesSelecionados.set([mockLotes[0]]);

    component.onExcluir();

    expect(lotesServiceSpy.excluirLote).toHaveBeenCalledWith(
      mockLotes[0].id
    );
    expect(lotesServiceSpy.buscarLotes).toHaveBeenCalledWith(
      filtros,
      component.paginaAtual()
    );
  });
});
