import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function intervaloValidator(
  campoInicial: string,
  campoFinal: string,
  nomeErro: string
): ValidatorFn {
  return (
    formulario: AbstractControl
  ): ValidationErrors | null => {
    const valorInicial =
      formulario.get(campoInicial)?.value;

    const valorFinal =
      formulario.get(campoFinal)?.value;

    if (
      valorInicial === null ||
      valorInicial === undefined ||
      valorFinal === null ||
      valorFinal === undefined
    ) {
      return null;
    }

    return valorInicial <= valorFinal
      ? null
      : {
          [nomeErro]: true,
        };
  };
}