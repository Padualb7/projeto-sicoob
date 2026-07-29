import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLotes } from './tabela-lotes';

describe('TabelaLotes', () => {
  let component: TabelaLotes;
  let fixture: ComponentFixture<TabelaLotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaLotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
