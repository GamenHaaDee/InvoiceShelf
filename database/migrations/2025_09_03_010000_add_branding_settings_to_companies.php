<?php

use App\Models\Company;
use App\Models\CompanySetting;
use App\Support\Branding;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Company::query()->each(function (Company $company) {
            foreach (Branding::defaults() as $option => $value) {
                CompanySetting::firstOrCreate(
                    [
                        'company_id' => $company->id,
                        'option' => $option,
                    ],
                    [
                        'value' => $value,
                    ]
                );
            }
        });
    }

    public function down(): void
    {
        CompanySetting::whereIn('option', array_keys(Branding::defaults()))->delete();
    }
};
