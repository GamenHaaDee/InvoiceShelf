<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CompaniesRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                Rule::unique('companies'),
                'string',
            ],
            'currency' => [
                'required',
            ],
            'address.name' => [
                'nullable',
            ],
            'address.address_street_1' => [
                'nullable',
            ],
            'address.address_street_2' => [
                'nullable',
            ],
            'address.city' => [
                'nullable',
            ],
            'address.state' => [
                'nullable',
            ],
            'address.country_id' => [
                'required',
            ],
            'address.zip' => [
                'nullable',
            ],
            'address.phone' => [
                'nullable',
            ],
            'address.fax' => [
                'nullable',
            ],
            'mail_servers' => [
                'nullable',
                'array',
                'max:3',
            ],
            'mail_servers.*.label' => [
                'nullable',
                'string',
                'max:255',
            ],
            'mail_servers.*.driver' => [
                'nullable',
                Rule::in(['smtp']),
            ],
            'mail_servers.*.host' => [
                'required',
                'string',
                'max:255',
            ],
            'mail_servers.*.port' => [
                'required',
                'integer',
                'between:1,65535',
            ],
            'mail_servers.*.username' => [
                'nullable',
                'string',
                'max:255',
            ],
            'mail_servers.*.password' => [
                'nullable',
                'string',
                'max:255',
            ],
            'mail_servers.*.encryption' => [
                'nullable',
                Rule::in(['none', 'ssl', 'tls']),
            ],
            'mail_servers.*.from_name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'mail_servers.*.from_address' => [
                'nullable',
                'email',
                'max:255',
            ],
            'mail_servers.*.is_primary' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    public function getCompanyPayload()
    {
        return collect($this->validated())
            ->only([
                'name',
                'vat_id',
                'tax_id',
            ])
            ->merge([
                'owner_id' => $this->user()->id,
                'slug' => Str::slug($this->name),
            ])
            ->toArray();
    }
}
