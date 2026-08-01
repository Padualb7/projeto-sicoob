import { SituacaoLote } from './situacao-lote.enum';

export interface FiltrosLote {
  instituicaoResponsavel: string | null;
  instituicao: string | null;
  situacao: SituacaoLote | null;
  idInicial: number | null;
  idFinal: number | null;
  valorInicial: number | null;
  valorFinal: number | null;
  dataEntradaInicial: Date | null;
  dataEntradaFinal: Date | null;
}