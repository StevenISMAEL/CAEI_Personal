<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCedula implements ValidationRule {
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, string, \Illuminate\Translation\PotentiallyTranslatedString): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        if (!$this->isValidCedula($value)) {
            $fail($attribute, "El :attribute no es una cédula válida.");
        }
    }

    /**
     * Validar si la cédula es válida.
     *
     * @param  string  $cedula
     * @return bool
     */
    protected function isValidCedula(string $cedula): bool {
        if (strlen($cedula) == 10 && ctype_digit($cedula)) {
            $digits = array_map("intval", str_split($cedula));
            $codigoProvincia = $digits[0] * 10 + $digits[1];

            if (
                $codigoProvincia >= 1 &&
                ($codigoProvincia <= 24 || $codigoProvincia == 30)
            ) {
                $digitoVerificador = array_pop($digits);
                $digitoCalculado =
                    array_reduce(
                        $digits,
                        function ($carry, $digit, $index) {
                            return $carry -
                                (($digit * (2 - ($index % 2))) % 9) -
                                ($digit == 9) * 9;
                        },
                        1000
                    ) % 10;

                return $digitoCalculado === $digitoVerificador;
            }
        }

        return false;
    }
}
