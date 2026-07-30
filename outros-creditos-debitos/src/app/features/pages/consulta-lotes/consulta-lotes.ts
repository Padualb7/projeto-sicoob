import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { PainelFiltrosComponent } from '../../components/painel-filtros/painel-filtros';
import { TabelaLotesComponent } from '../../components/tabela-lotes/tabela-lotes';

import { FiltrosLote } from '../../models/filtros-lote.model';
import { Lote } from '../../models/lote.model';
import { LotesService } from '../../services/lotes.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-consulta-lotes',
  standalone: true,
  imports: [
    PainelFiltrosComponent,
    TabelaLotesComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './consulta-lotes.html',
  styleUrl: './consulta-lotes.scss',
})
export class ConsultaLotesComponent {
  // Services
  private readonly lotesService = inject(LotesService);

  readonly lotes = signal<readonly Lote[]>([]);
  readonly carregando = signal(false);

  readonly lotesSelecionados = signal<readonly Lote[]>([]);

  readonly paginaAtual = signal(1);
  readonly totalPaginas = signal(20);

  readonly possuiUmLoteSelecionado = computed(
    () => this.lotesSelecionados().length === 1
  );

  readonly possuiLotesSelecionados = computed(
    () => this.lotesSelecionados().length > 0
  );

   onPesquisar(filtros: FiltrosLote): void {
    this.carregando.set(true);
    this.lotesSelecionados.set([]);
    this.paginaAtual.set(1);

    this.lotesService
      .buscarLotes(filtros, 1)
      .subscribe({
        next: (lotes) => {
          this.lotes.set(lotes);
        },
        error: (erro) => {
          console.error('Erro ao buscar lotes:', erro);
        },
        complete: () => {
          this.carregando.set(false);
        },
      });
  }

  onLimparFiltros(): void {
    this.paginaAtual.set(1);
    this.lotesSelecionados.set([]);

    console.log('Filtros limpos');

    // Posteriormente:
    // this.buscarLotes({}, 1);
  }

  onSelecaoAlterada(
    lotesSelecionados: readonly Lote[]
  ): void {
    this.lotesSelecionados.set(lotesSelecionados);
  }

  onPaginaAlterada(pagina: number): void {
    this.paginaAtual.set(pagina);
    this.lotesSelecionados.set([]);

    console.log('Página selecionada:', pagina);

    // Posteriormente:
    // this.buscarLotes(this.filtrosAtuais(), pagina);
  }

  onConfirmar(): void {
    console.log(
      'Confirmar lotes:',
      this.lotesSelecionados()
    );
  }

  onEnviar(): void {
    console.log(
      'Enviar lotes:',
      this.lotesSelecionados()
    );
  }

  onVisualizarJustificativa(): void {
    console.log(
      'Visualizar justificativa:',
      this.lotesSelecionados()
    );
  }

  onIncluir(): void {
    console.log('Incluir lançamento');
  }

  onAlterar(): void {
    const lote = this.obterLoteSelecionado();

    if (!lote) {
      return;
    }

    console.log('Alterar lote:', lote);
  }

  onExcluir(): void {
    const lote = this.obterLoteSelecionado();

    if (!lote) {
      return;
    }

    console.log('Excluir lote:', lote);
  }

  onVisualizar(): void {
    const lote = this.obterLoteSelecionado();

    if (!lote) {
      return;
    }

    console.log('Visualizar lote:', lote);
  }

  private obterLoteSelecionado(): Lote | null {
    if (!this.possuiUmLoteSelecionado()) {
      return null;
    }

    return this.lotesSelecionados()[0];
  }
}