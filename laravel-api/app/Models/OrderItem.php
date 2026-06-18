<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'product_id', 'name', 'price', 'qty', 'weight_kg'];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'qty' => 'integer',
            'weight_kg' => 'decimal:3',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
