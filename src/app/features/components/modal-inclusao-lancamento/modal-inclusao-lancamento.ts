import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Lancamento } from '../../models/lancamento.model';
import { ContaCorrenteService } from '../../services/conta-corrente.service';
import { TabelaLancamentoComponent } from '../tabela-lancamento/tabela-lancamento';
import { LancamentoService } from '../../services/lancamento.service';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-modal-inclusao-lancamento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TabelaLancamentoComponent,
    MatProgressSpinner
  ],
  templateUrl: './modal-inclusao-lancamento.html',
  styleUrl: './modal-inclusao-lancamento.scss',
})
export class ModalInclusaoLancamentoComponent {
  private readonly lancamentoService = inject(
    LancamentoService
  );

  readonly carregando = signal(false);
  readonly aberto = input.required<boolean>();

  readonly fechar = output<void>();
  readonly lancamentoIncluido = output<Lancamento>();

  private readonly contaCorrenteService = inject(
    ContaCorrenteService
  );

  titularEncontrado = '';

  readonly lancamentos = signal<Lancamento[]>([]);

  readonly lancamentoSelecionado =
    signal<Lancamento | null>(null);

  readonly visualizando = signal(false);
  readonly editando = signal(false);

  readonly possuiLancamentoSelecionado = computed(
    () => this.lancamentoSelecionado() !== null
  );

  readonly formulario = new FormGroup({
    contaCorrente: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    valor: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.01),
      ],
    }),

    historico: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    estorno: new FormControl(false, {
      nonNullable: true,
    }),

    documento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    descricao: new FormControl('', {
      nonNullable: true,
    }),

    situacao: new FormControl(
      {
        value: 'Pendente',
        disabled: true,
      },
      {
        nonNullable: true,
      }
    ),

    pa: new FormControl('', {
      nonNullable: true,
    }),
  });

  constructor() {
  this.formulario.controls.contaCorrente.valueChanges.subscribe(() => {
    this.titularEncontrado = '';

    this.formulario.controls.contaCorrente.setErrors(null);
  });
}
  selecionarLancamento(
    lancamento: Lancamento | null
  ): void {
    if (this.visualizando() || this.editando()) {
      return;
    }

    this.lancamentoSelecionado.set(lancamento);
  }

  buscarConta(): void {
    if (this.visualizando() || this.carregando()) {
      return;
    }

    const controle =
      this.formulario.controls.contaCorrente;

    const numeroConta = controle.value.trim();

    this.titularEncontrado = '';

    if (!numeroConta) {
      controle.markAsTouched();
      return;
    }

    this.carregando.set(true);

    this.contaCorrenteService
      .buscarConta(numeroConta)
      .pipe(
        finalize(() => {
          this.carregando.set(false);
        })
      )
      .subscribe({
        next: (conta) => {
          if (!conta) {
            controle.setErrors({
              contaNaoEncontrada: true,
            });

            controle.markAsTouched();
            return;
          }

          this.titularEncontrado = conta.titular;
          controle.setErrors(null);
        },
        error: () => {
          controle.setErrors({
            erroConsulta: true,
          });

          controle.markAsTouched();
        },
      });
  }

  confirmarInclusao(): void {
    if (
      this.carregando() ||
      this.editando() ||
      this.visualizando()
    ) {
      return;
    }

    if (!this.formularioValido()) {
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

    this.carregando.set(true);

    this.lancamentoService
      .incluirLancamento(lancamento)
      .pipe(
        finalize(() => {
          this.carregando.set(false);
        })
      )
      .subscribe({
        next: (lancamentoIncluido) => {
          this.lancamentos.update((atuais) => [
            ...atuais,
            lancamentoIncluido,
          ]);

          this.limparFormulario();
        },
        error: (erro) => {
          console.error(
            'Erro ao incluir lançamento:',
            erro
          );
        },
      });
  }

  visualizarLancamento(): void {
    const lancamento = this.lancamentoSelecionado();

    if (!lancamento) {
      return;
    }

    this.preencherFormulario(lancamento);

    this.formulario.disable();
    this.visualizando.set(true);
    this.editando.set(false);
  }

  alterarLancamento(): void {
    const lancamento = this.lancamentoSelecionado();

    if (!lancamento) {
      return;
    }

    this.formulario.enable();
    this.preencherFormulario(lancamento);

    this.formulario.controls.situacao.disable();

    this.editando.set(true);
    this.visualizando.set(false);
  }

  salvarAlteracao(): void {
    const selecionado = this.lancamentoSelecionado();

    if (!selecionado) {
      return;
    }

    if (!this.formularioValido()) {
      return;
    }

    const valores = this.formulario.getRawValue();

    const atualizado: Lancamento = {
      ...selecionado,
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

    this.lancamentos.update((atuais) =>
      atuais.map((lancamento) =>
        lancamento.id === selecionado.id
          ? atualizado
          : lancamento
      )
    );

    this.limparFormulario();
  }

  excluirLancamento(): void {
    const selecionado = this.lancamentoSelecionado();

    if (!selecionado) {
      return;
    }

    this.lancamentos.update((atuais) =>
      atuais.filter(
        (lancamento) =>
          lancamento.id !== selecionado.id
      )
    );

    this.limparFormulario();
  }

  duplicarLancamento(): void {
    const selecionado = this.lancamentoSelecionado();

    if (!selecionado) {
      return;
    }

    const duplicado: Lancamento = {
      ...selecionado,
      id: Date.now(),
      situacao: 'Pendente',
    };

    this.lancamentos.update((atuais) => [
      ...atuais,
      duplicado,
    ]);

    this.lancamentoSelecionado.set(null);
  }

  sairDaVisualizacao(): void {
    this.limparFormulario();
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  fecharModal(): void {
    this.limparFormulario();
    this.lancamentos.set([]);
    this.fechar.emit();
  }

  private formularioValido(): boolean {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return false;
    }

    if (!this.titularEncontrado) {
      const controle =
        this.formulario.controls.contaCorrente;

      controle.setErrors({
        contaNaoEncontrada: true,
      });

      controle.markAsTouched();
      return false;
    }

    return true;
  }

  private preencherFormulario(
    lancamento: Lancamento
  ): void {
    this.titularEncontrado = lancamento.titular;

    this.formulario.patchValue({
      contaCorrente: lancamento.contaCorrente,
      valor: lancamento.valor,
      historico: lancamento.historico,
      estorno: lancamento.estorno,
      documento: lancamento.documento,
      descricao: lancamento.descricao,
      situacao: lancamento.situacao,
      pa: lancamento.pa,
    });
  }

  private limparFormulario(): void {
    this.formulario.enable();

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

    this.formulario.controls.situacao.disable();

    this.titularEncontrado = '';
    this.lancamentoSelecionado.set(null);
    this.visualizando.set(false);
    this.editando.set(false);
  }
}