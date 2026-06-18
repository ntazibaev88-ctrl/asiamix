<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'code', 'client_id', 'store_id', 'courier_id', 'promo_code_id',
        'status', 'payment_method', 'subtotal', 'delivery_fee', 'service_fee',
        'discount', 'total', 'store_amount', 'courier_amount', 'platform_amount',
        'collected_amount', 'weight_kg', 'address', 'comment', 'settled_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_method' => PaymentMethod::class,
            'subtotal' => 'integer',
            'delivery_fee' => 'integer',
            'service_fee' => 'integer',
            'discount' => 'integer',
            'total' => 'integer',
            'store_amount' => 'integer',
            'courier_amount' => 'integer',
            'platform_amount' => 'integer',
            'collected_amount' => 'integer',
            'weight_kg' => 'decimal:3',
            'settled_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function settlement(): BelongsTo
    {
        return $this->belongsTo(CashSettlement::class);
    }

    public function isSettled(): bool
    {
        return $this->status === OrderStatus::Settled;
    }
}
