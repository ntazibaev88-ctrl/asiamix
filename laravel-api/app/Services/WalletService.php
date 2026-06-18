<?php

namespace App\Services;

use App\Enums\LedgerType;
use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\Wallet;

/**
 * Atomically moves money on a wallet and writes the journal line. Always call
 * inside a DB transaction (CashSettlementService wraps these). The wallet row is
 * locked (`lockForUpdate`) so concurrent settlements can't corrupt the balance.
 */
class WalletService
{
    public function credit(Wallet $wallet, int $amount, LedgerType $type, ?Order $order = null, array $meta = []): LedgerEntry
    {
        return $this->move($wallet, $amount, 'credit', $type, $order, $meta);
    }

    public function debit(Wallet $wallet, int $amount, LedgerType $type, ?Order $order = null, array $meta = []): LedgerEntry
    {
        return $this->move($wallet, $amount, 'debit', $type, $order, $meta);
    }

    private function move(Wallet $wallet, int $amount, string $direction, LedgerType $type, ?Order $order, array $meta): LedgerEntry
    {
        if ($amount < 0) {
            throw new \InvalidArgumentException('amount_must_be_positive');
        }

        $fresh = Wallet::whereKey($wallet->id)->lockForUpdate()->firstOrFail();
        $fresh->balance += $direction === 'credit' ? $amount : -$amount;
        $fresh->save();

        return LedgerEntry::create([
            'order_id' => $order?->id,
            'wallet_id' => $fresh->id,
            'type' => $type->value,
            'direction' => $direction,
            'amount' => $amount,
            'balance_after' => $fresh->balance,
            'meta' => $meta ?: null,
        ]);
    }
}
