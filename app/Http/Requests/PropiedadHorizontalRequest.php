<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropiedadHorizontalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    protected function prepareForValidation()
    {
        $this->merge([
            'definitivo' => $this->booleanValue('definitivo'),
            'modificatorio' => $this->booleanValue('modificatorio'),
        ]);
    }
    private function booleanValue($field)
    {
        $value = $this->input($field);
        return ($value === null || $value === '') ? 0 : (int)$value;
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
                    'id_tramite' => 'required|integer|exists:tramites,id_tramite', // Relación con la tabla tramites
                    'definitivo' => 'required|boolean',
                    'modificatorio' => 'required|boolean',
                    'uso_suelo' => 'required|string|max:20',
                    'area_construccion' => 'required|numeric|min:0',
                ];

            case 'PATCH':
                return [
                    'id_tramite' => 'sometimes|required|integer|exists:tramites,id_tramite',
                    'definitivo' => 'sometimes|required|boolean',
                    'modificatorio' => 'sometimes|required|boolean',
                    'uso_suelo' => 'sometimes|required|string|max:20',
                    'area_construccion' => 'sometimes|required|numeric|min:0',
                ];

            case 'DELETE':
                return [
                    'id_propiedadh' => 'required|integer|exists:propiedad_horizontal,id_propiedadh',
                ];

            default:
                return [];
        }
    }
}
