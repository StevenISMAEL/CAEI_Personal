<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TramiteRequest extends FormRequest {
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
                    "id_usuario" => "required|integer|exists:users,id", // Relación con la tabla usuarios
                    "id_tipotramite" =>
                        "required|string|max:7|exists:tipos_tramites,id_tipotramite", // Relación con la tabla de tipos de trámites
                    "tramite" => "required|string|max:250",
                    "propietario" => "required|string|max:250",
                    "fecha_ingreso" => "required|date",
                    "fecha_salida" => "nullable|date",
                    "informe" => "nullable|string|max:30",
                    "entregado" => "nullable|string|max:250",
                    "fecha_entrega" => "nullable|date",
                    "reasignado" => "nullable|string|max:250",
                    "fecha_reasignacion" => "nullable|date",
                    "arquitecto_responsable" => "nullable|string|max:250",
                    "clave_catastral" => "nullable|string|max:150",
                    "direccion" => "nullable|string|max:300",
                    "estado_tramite" => "required|string|max:15",
                    "estado_ingreso" => "required|string|max:15",
                    "correo_electronico" => "required|string|max:200",
                    "num_observaciones" => "nullable|integer|min:0",
                ];

            case "PATCH":
                return [
                    "id_usuario" =>
                        "sometimes|required|integer|exists:users,id",
                    "id_tipotramite" =>
                        "sometimes|required|string|max:7|exists:tipos_tramites,id_tipotramite",
                    "tramite" => "sometimes|required|string|max:250",
                    "propietario" => "sometimes|required|string|max:250",
                    "fecha_ingreso" => "sometimes|required|date",
                    "fecha_salida" => "sometimes|nullable|date",
                    "informe" => "sometimes|nullable|string|max:30",
                    "entregado" => "sometimes|nullable|string|max:250",
                    "fecha_entrega" => "sometimes|nullable|date",
                    "reasignado" => "sometimes|nullable|string|max:250",
                    "fecha_reasignacion" => "sometimes|nullable|date",
                    "arquitecto_responsable" =>
                        "sometimes|nullable|string|max:250",
                    "clave_catastral" => "sometimes|nullable|string|max:150",
                    "direccion" => "sometimes|nullable|string|max:300",
                    "estado_tramite" => "sometimes|required|string|max:15",
                    "estado_ingreso" => "sometimes|required|string|max:15",
                    "correo_electronico" => "sometimes|required|string|max:200",
                    "num_observaciones" => "sometimes|nullable|integer|min:0",
                ];

            case "DELETE":
                return [
                    "id_tramite" =>
                        "required|integer|exists:tramites,id_tramite",
                ];

            default:
                return [];
        }
    }
}
