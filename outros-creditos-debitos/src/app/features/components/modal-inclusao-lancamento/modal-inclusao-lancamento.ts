import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Lancamento } from '../../models/lancamento.model';
import { TabelaLancamentoComponent } from "../tabela-lancamento/tabela-lancamento";
import { ContaCorrenteService } from '../../services/conta-corrente.service';

@Component({
  selector: 'app-modal-inclusao-lancamento',
  standalone: true,
  imports: [ReactiveFormsModule, TabelaLancamentoComponent],
  templateUrl: './modal-inclusao-lancamento.html',
  styleUrl: './modal-inclusao-lancamento.scss'
})
export class ModalInclusaoLancamentoComponent {

  //Inputs e Outputs
  aberto = input.required<boolean>();

  fechar = output<void>();
  lancamentoIncluido = output<Lancamento>();

  // Services
  private readonly contaCorrenteService = inject(
    ContaCorrenteService
  );

  titularEncontrado = '';
  mensagemErroConta = '';

  readonly formulario = new FormGroup({
    contaCorrente: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    valor: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.01)
      ]
    }),

    historico: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    estorno: new FormControl(false, {
      nonNullable: true
    }),

    documento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    descricao: new FormControl('', {
      nonNullable: true
    }),

    situacao: new FormControl(
      { value: 'Pendente', disabled: true },
      {
        nonNullable: true
      }
    ),

    pa: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  readonly lancamentos = signal<Lancamento[]>([]);

  readonly lancamentoSelecionado =
    signal<Lancamento | null>(null);

  selecionarLancamento(
    lancamento: Lancamento | null,
  ): void {
    this.lancamentoSelecionado.set(lancamento);
  }

  fecharModal(): void {
    this.formulario.reset({
      contaCorrente: '',
      valor: null,
      historico: '',
      estorno: false,
      documento: '',
      descricao: '',
      situacao: 'Pendente',
      pa: ''
    });

    this.titularEncontrado = '';
    this.fechar.emit();
  }

  confirmarInclusao(): void {
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }

  if (!this.titularEncontrado) {
    this.formulario.controls.contaCorrente.setErrors({
      contaNaoEncontrada: true,
    });

    this.formulario.controls.contaCorrente.markAsTouched();
    return;
  }

  const valores = this.formulario.getRawValue();

  const lancamento: Lancamento = {
    id: Date.now(),
    contaCorrente: valores.contaCorrente,
    titular: this.titularEncontrado,
    valor: valores.valor!,
    historico: valores.historico,
    estorno: valores.estorno,
    documento: valores.documento,
    descricao: valores.descricao,
    situacao: valores.situacao,
    pa: valores.pa,
  };

  this.lancamentos.update((atuais) => [
    ...atuais,
    lancamento,
  ]);

  this.limparFormulario();
}

  buscarConta(): void {
  const controle =
    this.formulario.controls.contaCorrente;

  const numeroConta = controle.value;

  if (!numeroConta) {
    controle.markAsTouched();
    return;
  }

  this.contaCorrenteService
    .buscarConta(numeroConta)
    .subscribe((conta) => {
      this.titularEncontrado = conta?.titular ?? '';

      controle.setErrors(
        conta ? null : { contaNaoEncontrada: true }
      );

      controle.markAsTouched();
    });
}

private limparFormulario(): void {
  this.formulario.reset({
    contaCorrente: '',
    valor: null,
    historico: '',
    estorno: false,
    documento: '',
    descricao: '',
    situacao: 'Pendente',
    pa: '',
  });

  this.titularEncontrado = '';
  this.lancamentoSelecionado.set(null);
}
}