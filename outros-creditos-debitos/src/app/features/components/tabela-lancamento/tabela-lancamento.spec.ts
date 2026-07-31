import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLancamento } from './tabela-lancamento';

describe('TabelaLancamento', () => {
  let component: TabelaLancamento;
  let fixture: ComponentFixture<TabelaLancamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLancamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaLancamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
