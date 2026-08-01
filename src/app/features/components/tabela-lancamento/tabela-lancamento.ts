import {
  Component,
  input,
  output,
} from '@angular/core';
import {
  CurrencyPipe,
} from '@angular/common';

import { Lancamento } from '../../models/lancamento.model';

@Component({
  selector: 'app-tabela-lancamentos',
  standalone: true,
  imports: [
    CurrencyPipe,
  ],
  templateUrl: './tabela-lancamento.html',
  styleUrl: './tabela-lancamento.scss',
})
export class TabelaLancamentoComponent {
  readonly lancamentos =
    input.required<readonly Lancamento[]>();

  readonly lancamentoSelecionado =
    input<Lancamento | null>(null);

  readonly selecaoAlterada =
    output<Lancamento | null>();

  estaSelecionado(lancamento: Lancamento): boolean {
    return (
      this.lancamentoSelecionado()?.id === lancamento.id
    );
  }

  selecionarLancamento(
    lancamento: Lancamento,
  ): void {
    if (this.estaSelecionado(lancamento)) {
      this.selecaoAlterada.emit(null);
      return;
    }

    this.selecaoAlterada.emit(lancamento);
  }
}