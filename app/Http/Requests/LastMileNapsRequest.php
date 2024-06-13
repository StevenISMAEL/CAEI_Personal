<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LastMileNapsRequest extends FormRequest
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
                    "last_mile_nap_id" => "string|max:8|unique:ip_last_mile_naps,last_mile_nap_id",
                    "distribution_nap_id" => "required|string|max:8|exists:ip_distribution_naps,distribution_nap_id",
                    "last_mile_nap_name" => "required|string|max:50",
                    "last_mile_nap_address" => "required|string|max:100",
                    "last_mile_nap_coordx" => "required|string|max:25",
                    "last_mile_nap_coordy" => "required|string|max:25",
                    "last_mile_nap_splitter" => "required|integer|between:0,24",
                ];
            case "PATCH":
                return [
                    "distribution_nap_id" => "sometimes|required|string|max:8|exists:ip_distribution_naps,distribution_nap_id",
                    "last_mile_nap_name" => "sometimes|required|string|max:50",
                    "last_mile_nap_address" => "sometimes|required|string|max:100",
                    "last_mile_nap_coordx" => "sometimes|required|string|max:25",
                    "last_mile_nap_coordy" => "sometimes|required|string|max:25",
                    "last_mile_nap_splitter" => "sometimes|required|integer|between:0,24",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:ip_last_mile_naps,last_mile_nap_id",
                ];
            default:
                return [];
        }
    
    }
}
