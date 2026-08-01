import {
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CurrencyPipe,
  DatePipe,
} from '@angular/common';

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
  readonly lotes =
    input.required<readonly Lote[]>();

  readonly paginaAtual = input(1);
  readonly totalRegistros = input(0);
  readonly tamanhoPagina = input(10);

  readonly selecaoAlterada =
    output<readonly Lote[]>();

  readonly paginaAlterada = output<number>();

  readonly idsSelecionados =
    signal<Set<number>>(new Set());

  readonly totalPaginas = computed(() => {
    const totalRegistros = this.totalRegistros();
    const tamanhoPagina = this.tamanhoPagina();

    if (totalRegistros === 0 || tamanhoPagina <= 0) {
      return 1;
    }

    return Math.ceil(
      totalRegistros / tamanhoPagina
    );
  });

  readonly todosSelecionados = computed(() => {
    const lotes = this.lotes();
    const idsSelecionados = this.idsSelecionados();

    return (
      lotes.length > 0 &&
      lotes.every((lote) =>
        idsSelecionados.has(lote.id)
      )
    );
  });

  readonly parcialmenteSelecionados =
    computed(() => {
      const lotes = this.lotes();
      const idsSelecionados =
        this.idsSelecionados();

      const quantidadeSelecionada =
        lotes.filter((lote) =>
          idsSelecionados.has(lote.id)
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
    () =>
      this.paginaAtual() >= this.totalPaginas()
  );

  loteEstaSelecionado(
    idLote: number
  ): boolean {
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
      this.lotes().forEach((lote) => {
        selecionados.delete(lote.id);
      });
    } else {
      this.lotes().forEach((lote) => {
        selecionados.add(lote.id);
      });
    }

    this.idsSelecionados.set(selecionados);
    this.emitirSelecao();
  }

  irParaPrimeiraPagina(): void {
    this.irParaPagina(1);
  }

  irParaPaginaAnterior(): void {
    this.irParaPagina(
      this.paginaAtual() - 1
    );
  }

  irParaProximaPagina(): void {
    this.irParaPagina(
      this.paginaAtual() + 1
    );
  }

  irParaUltimaPagina(): void {
    this.irParaPagina(
      this.totalPaginas()
    );
  }

  irParaPagina(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginas() ||
      pagina === this.paginaAtual()
    ) {
      return;
    }

    this.limparSelecao();
    this.paginaAlterada.emit(pagina);
  }

  limparSelecao(): void {
    this.idsSelecionados.set(new Set());
    this.selecaoAlterada.emit([]);
  }

  private emitirSelecao(): void {
    const selecionados = this.lotes().filter(
      (lote) =>
        this.idsSelecionados().has(lote.id)
    );

    this.selecaoAlterada.emit(selecionados);
  }
}