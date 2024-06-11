<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidCedula;

class ClientRequest extends FormRequest {
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
                    "client_id" => [
                        "required",
                        "string",
                        "size:10",
                        // new ValidCedula,
                    ],
                    "address_id" =>
                        "required|string|max:7|exists:con_address,address_id",
                    "client_name" => "required|string|max:150",
                    "client_email" => "required|string|email|max:250",
                ];
            case "PATCH":
                return [
                    "address_id" =>
                        "sometimes|required|string|max:7|exists:con_address,address_id",
                    "client_name" => "sometimes|required|string|max:150",
                    "client_email" => "sometimes|required|string|email|max:250",
                ];
            case "DELETE":
                return [
                    "client_id" =>
                        "required|string|size:10|exists:con_clients,client_id",
                ];
            default:
                return [];
        }
    }
}
