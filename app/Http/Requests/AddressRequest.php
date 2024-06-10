<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest {
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
                    "parish_id" =>
                        "required|string|max:7|exists:con_parishes,parish_id",
                    "address" => "required|string|max:100",
                    "reference" => "required|string|max:100",
                    "neighborhood" => "required|string|max:100",
                ];
            case "PATCH":
                return [
                    "parish_id" =>
                        "sometimes|required|string|max:7|exists:con_parishes,parish_id",
                    "address" => "sometimes|required|string|max:100",
                    "reference" => "nullable|string|max:100",
                    "neighborhood" => "nullable|string|max:100",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:con_address,address_id",
                ];
            default:
                return [];
        }
    }
}
