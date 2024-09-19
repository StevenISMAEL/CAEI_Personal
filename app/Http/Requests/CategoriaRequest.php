<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoriaRequest extends FormRequest
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
                ];
            case "PATCH":
                return [
                    "nombre" => "sometimes|required|string|max:200",
                ];
            case "DELETE":
                return [
                    "id_categoria" => "required|string|exists:categorias,id_categoria",
                ];
            default:
                return [];
        }
    }
}
