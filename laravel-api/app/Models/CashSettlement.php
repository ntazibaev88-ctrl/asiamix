<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashSettlement extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id', 'courier_id', 'expected_amount', 'collected_amount',
        'difference', 'store_amount', 'courier_amount', 'platform_amount',
        'promo_amount', 'courier_owes',
    ];

    protected function casts(): array
    {
        return [
            'expected_amount' => 'integer',
            'collected_amount' => 'integer',
            'difference' => 'integer',
            'store_amount' => 'integer',
            'courier_amount' => 'integer',
            'platform_amount' => 'integer',
            'promo_amount' => 'integer',
            'courier_owes' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }
}
