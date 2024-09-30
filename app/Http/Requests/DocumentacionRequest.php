<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentacionRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        switch ($this->method()) {
            case "POST":
                return [
                    "id_tramite" =>
                        "required|integer|exists:tramites,id_tramite",
                    "tipo_documento" => "required|string|max:50",
                    "archivo" => "required|file",
                ];

            case "DELETE":
                return [
                    "id_documento" =>
                        "required|integer|exists:documentos,id_documento",
                ];

            default:
                return [];
        }
    }
}
