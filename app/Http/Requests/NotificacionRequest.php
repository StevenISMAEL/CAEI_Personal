<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotificacionRequest extends FormRequest {
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
                    "estado" => "required|string|max:15",

                ];
            case "DELETE":
                return [
                    "id_notificacion" =>
                        "required|string|exists:notificaciones,id_notificacion",
                ];
            default:
                return [];
        }
    }
}
