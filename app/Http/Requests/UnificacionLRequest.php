<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnificacionLRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        switch ($this->method()) {
            case 'POST':
                return [
                    'id_tramite' => 'required|integer|exists:tramites,id_tramite',
                    'area_aprobada' => 'required|numeric|min:0', // Decimal
                ];

            case 'PATCH':
                return [
                    'id_tramite' => 'sometimes|required|integer|exists:tramites,id_tramite',
                    'area_aprobada' => 'sometimes|required|numeric|min:0', // Decimal
                ];

            case 'DELETE':
                return [
                    'id_unificacion' => 'required|integer|exists:unificacion_lotes,id_unificacion',
                ];

            default:
                return [];
        }
    }
}
