import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FiltrosLote } from '../../models/filtros-lote.model';
import { SituacaoLote } from '../../models/situacao-lote.enum';
import { intervaloValidator } from '../../../shared/validators/intervalo.validator';

@Component({
  selector: 'app-painel-filtros',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './painel-filtros.html',
  styleUrl: './painel-filtros.scss',
})
export class PainelFiltrosComponent {
  readonly pesquisar = output<FiltrosLote>();
  readonly limpar = output<void>();

  readonly situacoes = [
    { label: 'Todas', value: null },
    { label: 'Aberto', value: SituacaoLote.ABERTO },
    { label: 'Enviado', value: SituacaoLote.ENVIADO },
    { label: 'Confirmado', value: SituacaoLote.CONFIRMADO },
  ];

 readonly formulario = new FormGroup(
  {
    instituicaoResponsavel: new FormControl<string | null>(null),
    instituicao: new FormControl<string | null>(null),
    situacao: new FormControl<SituacaoLote | null>(null),

    idInicial: new FormControl<number | null>(null),
    idFinal: new FormControl<number | null>(null),

    valorInicial: new FormControl<number | null>(null),
    valorFinal: new FormControl<number | null>(null),

    dataEntradaInicial: new FormControl<Date | null>(null),
    dataEntradaFinal: new FormControl<Date | null>(null),
  },
  {
    validators: [
      intervaloValidator(
        'idInicial',
        'idFinal',
        'intervaloIdInvalido'
      ),
      intervaloValidator(
        'valorInicial',
        'valorFinal',
        'intervaloValorInvalido'
      ),
      intervaloValidator(
        'dataEntradaInicial',
        'dataEntradaFinal',
        'intervaloDataInvalido'
      ),
    ],
  }
);
expandido = true;

  onPesquisar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.pesquisar.emit(
      this.formulario.getRawValue() as FiltrosLote
    );
  }

  onLimpar(): void {
    this.formulario.reset();
    this.limpar.emit();
  }
  toggle(): void {
  this.expandido = !this.expandido;
}
}