<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanoArqRequest extends FormRequest
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
            'anteproyecto' => $this->booleanValue('anteproyecto'),
            'definitivo' => $this->booleanValue('definitivo'),
            'modificatorio' => $this->booleanValue('modificatorio'),
            'ampliatorio' => $this->booleanValue('ampliatorio'),
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
                    'anteproyecto' => 'required|boolean',
                    'definitivo' => 'required|boolean',
                    'modificatorio' => 'required|boolean',
                    'ampliatorio' => 'required|boolean',
                    'uso_suelo' => 'required|string|max:20',
                    'area_construccion' => 'required|numeric|min:0',
                    'area_construccion2' => 'nullable|numeric|min:0',
                ];

            case 'PATCH':
                return [
                    'id_tramite' => 'sometimes|required|integer|exists:tramites,id_tramite',
                    'anteproyecto' => 'sometimes|required|boolean',
                    'definitivo' => 'sometimes|required|boolean',
                    'modificatorio' => 'sometimes|required|boolean',
                    'ampliatorio' => 'sometimes|required|boolean',
                    'uso_suelo' => 'sometimes|required|string|max:20',
                    'area_construccion' => 'sometimes|required|numeric|min:0',
                    'area_construccion2' => 'sometimes|nullable|numeric|min:0',
                ];

            case 'DELETE':
                return [
                    'id_planosarq' => 'required|integer|exists:planos_arquitectonicos,id_planosarq',
                ];

            default:
                return [];
        }
    }
}
