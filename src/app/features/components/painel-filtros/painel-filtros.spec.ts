import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelFiltrosComponent } from './painel-filtros';

describe('PainelFiltrosComponent', () => {
  let component: PainelFiltrosComponent;
  let fixture: ComponentFixture<PainelFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFiltrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    expect(component.expandido).toBeTrue();

    component.toggle();
    expect(component.expandido).toBeFalse();

    component.toggle();
    expect(component.expandido).toBeTrue();
  });

  it('should initialize form with correct controls', () => {
    expect(component.formulario.get('instituicaoResponsavel')).toBeTruthy();
    expect(component.formulario.get('instituicao')).toBeTruthy();
    expect(component.formulario.get('situacao')).toBeTruthy();
    expect(component.formulario.get('idInicial')).toBeTruthy();
    expect(component.formulario.get('idFinal')).toBeTruthy();
    expect(component.formulario.get('valorInicial')).toBeTruthy();
    expect(component.formulario.get('valorFinal')).toBeTruthy();
    expect(component.formulario.get('dataEntradaInicial')).toBeTruthy();
    expect(component.formulario.get('dataEntradaFinal')).toBeTruthy();
  });

  it('should validate interval form with intervaloValidator', () => {
    const form = component.formulario;
    form.get('idInicial')?.setValue(5);
    form.get('idFinal')?.setValue(3);

    form.updateValueAndValidity();
    expect(form.hasError('intervaloIdInvalido')).toBeTrue();

    form.get('idFinal')?.setValue(10);
    form.updateValueAndValidity();
    expect(form.hasError('intervaloIdInvalido')).toBeFalse();
  });

  it('should emit pesquisar event with form value when valid', () => {
    const emitSpy = spyOn(component.pesquisar, 'emit');
    component.formulario.get('instituicao')?.setValue('001');
    component.formulario.get('idInicial')?.setValue(1);
    component.formulario.get('idFinal')?.setValue(10);

    component.onPesquisar();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit pesquisar event when form is invalid', () => {
    const emitSpy = spyOn(component.pesquisar, 'emit');
    component.formulario.get('idInicial')?.setValue(10);
    component.formulario.get('idFinal')?.setValue(5);

    component.onPesquisar();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit limpar event and reset form when onLimpar is called', () => {
    const emitSpy = spyOn(component.limpar, 'emit');
    component.formulario.get('instituicao')?.setValue('001');

    component.onLimpar();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.formulario.get('instituicao')?.value).toBeNull();
  });
});
