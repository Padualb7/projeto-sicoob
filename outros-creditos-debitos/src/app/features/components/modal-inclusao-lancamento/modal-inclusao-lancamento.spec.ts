import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInclusaoLancamento } from './modal-inclusao-lancamento';

describe('ModalInclusaoLancamento', () => {
  let component: ModalInclusaoLancamento;
  let fixture: ComponentFixture<ModalInclusaoLancamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInclusaoLancamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInclusaoLancamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
