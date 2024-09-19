<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TipoTramiteRequest extends FormRequest
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
            case "POST":
                return [
                    "nombre" => "required|string|max:200",
                    "id_categoria" => "required|string|max:7|exists:categorias,id_categoria",
                ];
            case "PATCH":
                return [
                    "nombre" => "sometimes|required|string|max:200",
                    "id_categoria" => "required|string|max:7|exists:categorias,id_categoria",

                ];
            case "DELETE":
                return [
                    "id_tipotramite" => "required|string|exists:tipos_tramites,id_tipotramite",
                ];
            default:
                return [];
        }
    }
}
