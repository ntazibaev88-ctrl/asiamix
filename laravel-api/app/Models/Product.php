<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'store_id', 'name', 'category', 'brand', 'price', 'weight_kg',
        'stock', 'unit', 'image_url', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'weight_kg' => 'decimal:3',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
