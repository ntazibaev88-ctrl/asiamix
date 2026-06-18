<?php

namespace App\Models;

use App\Enums\WalletOwner;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Courier extends Model
{
    protected $fillable = [
        'user_id', 'vehicle', 'cash_balance', 'available', 'lat', 'lng',
    ];

    protected function casts(): array
    {
        return [
            'cash_balance' => 'integer',
            'available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** The courier's earnings wallet (delivery payouts). */
    public function wallet()
    {
        return Wallet::firstOrCreate(
            ['owner_type' => WalletOwner::Courier->value, 'owner_id' => $this->id],
        );
    }
}
