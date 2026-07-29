import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelFiltrosComponent } from './painel-filtros';



describe('PainelFiltrosComponent', () => {
  let component: PainelFiltrosComponent;
  let fixture: ComponentFixture<PainelFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFiltrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
