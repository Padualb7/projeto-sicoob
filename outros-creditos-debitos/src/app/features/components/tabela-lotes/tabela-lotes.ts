import {
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Lote } from '../../models/lote.model';

@Component({
  selector: 'app-tabela-lotes',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './tabela-lotes.html',
  styleUrl: './tabela-lotes.scss',
})
export class TabelaLotesComponent {
  readonly lotes = input.required<readonly Lote[]>();

  readonly paginaAtual = input(1);
  readonly totalPaginas = input(1);

  readonly selecaoAlterada = output<readonly Lote[]>();
  readonly paginaAlterada = output<number>();

  readonly idsSelecionados = signal<Set<number>>(new Set());

  readonly todosSelecionados = computed(() => {
    const lotes = this.lotes();

    return (
      lotes.length > 0 &&
      lotes.every((lote) =>
        this.idsSelecionados().has(lote.id)
      )
    );
  });

  readonly parcialmenteSelecionados = computed(() => {
    const lotes = this.lotes();

    const quantidadeSelecionada = lotes.filter((lote) =>
      this.idsSelecionados().has(lote.id)
    ).length;

    return (
      quantidadeSelecionada > 0 &&
      quantidadeSelecionada < lotes.length
    );
  });

  readonly estaNaPrimeiraPagina = computed(
    () => this.paginaAtual() <= 1
  );

  readonly estaNaUltimaPagina = computed(
    () => this.paginaAtual() >= this.totalPaginas()
  );

  loteEstaSelecionado(idLote: number): boolean {
    return this.idsSelecionados().has(idLote);
  }

  alternarSelecao(lote: Lote): void {
    const selecionados = new Set(
      this.idsSelecionados()
    );

    if (selecionados.has(lote.id)) {
      selecionados.delete(lote.id);
    } else {
      selecionados.add(lote.id);
    }

    this.idsSelecionados.set(selecionados);
    this.emitirSelecao();
  }

  alternarTodos(): void {
    const selecionados = new Set(
      this.idsSelecionados()
    );

    if (this.todosSelecionados()) {
      for (const lote of this.lotes()) {
        selecionados.delete(lote.id);
      }
    } else {
      for (const lote of this.lotes()) {
        selecionados.add(lote.id);
      }
    }

    this.idsSelecionados.set(selecionados);
    this.emitirSelecao();
  }

  irParaPrimeiraPagina(): void {
    this.irParaPagina(1);
  }

  irParaPaginaAnterior(): void {
    this.irParaPagina(this.paginaAtual() - 1);
  }

  irParaProximaPagina(): void {
    this.irParaPagina(this.paginaAtual() + 1);
  }

  irParaUltimaPagina(): void {
    this.irParaPagina(this.totalPaginas());
  }

  irParaPagina(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginas() ||
      pagina === this.paginaAtual()
    ) {
      return;
    }

    this.paginaAlterada.emit(pagina);
  }

  private emitirSelecao(): void {
    const selecionados = this.lotes().filter((lote) =>
      this.idsSelecionados().has(lote.id)
    );

    this.selecaoAlterada.emit(selecionados);
  }
}