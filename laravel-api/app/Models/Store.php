<?php

namespace App\Models;

use App\Enums\WalletOwner;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = [
        'owner_id', 'name', 'slug', 'address', 'lat', 'lng',
        'commission_rate', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** The store's wallet (its available balance). */
    public function wallet()
    {
        return Wallet::firstOrCreate(
            ['owner_type' => WalletOwner::Store->value, 'owner_id' => $this->id],
        );
    }
}
