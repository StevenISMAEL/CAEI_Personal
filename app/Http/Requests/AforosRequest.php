<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AforosRequest extends FormRequest
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
                    'uso_suelo' => 'required|string|max:20', 
                    'local_comercial' => 'required|string|max:150', 
                    'aforo_personas' => 'required|integer|min:0', 
                    'area_construccion' => 'required|numeric|min:0',
                    'inspeccion' => 'required|date', 
                ];
    
            case 'PATCH':
                return [
                    'id_tramite' => 'sometimes|required|integer|exists:tramites,id_tramite', 
                    'uso_suelo' => 'sometimes|required|string|max:20',
                    'local_comercial' => 'sometimes|required|string|max:150', 
                    'aforo_personas' => 'sometimes|required|integer|min:0', 
                    'area_construccion' => 'sometimes|required|numeric|min:0', 
                    'inspeccion' => 'sometimes|required|date', 
                ];
    
            case 'DELETE':
                return [
                    'id_aforo' => 'required|integer|exists:aforos,id_aforo', 
                ];
    
            default:
                return [];
        }
    }
}
