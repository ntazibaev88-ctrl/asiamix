<?php

namespace App\Models;

use App\Enums\WalletOwner;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = ['owner_type', 'owner_id', 'balance'];

    protected function casts(): array
    {
        return [
            'owner_type' => WalletOwner::class,
            'balance' => 'integer',
        ];
    }

    public function entries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }

    /** The single platform wallet (created on first use). */
    public static function platform(): self
    {
        return static::firstOrCreate(
            ['owner_type' => WalletOwner::Platform->value, 'owner_id' => null],
        );
    }
}
