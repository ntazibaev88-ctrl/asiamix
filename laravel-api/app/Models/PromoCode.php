<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'min_order', 'max_uses',
        'used_count', 'active', 'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'min_order' => 'integer',
            'active' => 'boolean',
            'expires_at' => 'datetime',
        ];
    }

    public function isUsable(int $subtotal): bool
    {
        if (! $this->active) {
            return false;
        }
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return false;
        }
        return $subtotal >= $this->min_order;
    }

    /** Discount (tenge) for a given subtotal + delivery fee. */
    public function discountFor(int $subtotal, int $delivery): int
    {
        return match ($this->type) {
            'percent' => (int) round($subtotal * $this->value / 100),
            'delivery' => (int) round($delivery * $this->value / 100),
            default => min($this->value, $subtotal), // fixed
        };
    }
}
