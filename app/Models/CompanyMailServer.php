<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyMailServer extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'label',
        'driver',
        'host',
        'port',
        'username',
        'password',
        'encryption',
        'from_name',
        'from_address',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'port' => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
