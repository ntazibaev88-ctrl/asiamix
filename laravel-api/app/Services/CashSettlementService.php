<?php

namespace App\Services;

use App\Enums\LedgerType;
use App\Enums\OrderStatus;
use App\Models\CashSettlement;
use App\Models\Order;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;

/**
 * Settles a CASH order when the courier closes it.
 *
 * Flow (all inside one DB transaction so money is never half-moved):
 *   1. split the order      (PricingService)
 *   2. store wallet    += goods            (subtotal)
 *   3. courier wallet  += delivery         (courier earnings)
 *   4. platform wallet += service − promo  (platform margin; promo is funded
 *                                           by the platform as a marketing cost)
 *   5. courier cash drawer += collected − delivery   (cash owed to platform)
 *   6. write a ledger line per wallet move + a cash_settlements receipt
 *   7. mark the order Settled
 *
 * Example (spec): goods 4530, delivery 500, service 200, promo 450 →
 *   client pays 4780; store +4530, courier +500, platform +200 (−450 promo),
 *   courier drawer +4280 (4780 − 500).
 */
class CashSettlementService
{
    public function __construct(
        private PricingService $pricing,
        private WalletService $wallets,
    ) {}

    public function settle(Order $order, int $collected): CashSettlement
    {
        if ($order->isSettled()) {
            throw new \RuntimeException('order_already_settled');
        }
        if (! $order->courier_id) {
            throw new \RuntimeException('order_has_no_courier');
        }

        return DB::transaction(function () use ($order, $collected) {
            // Lock the order row for the duration of the settlement.
            $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            $split = $this->pricing->split($order);
            $promo = (int) $order->discount;
            $expected = $split['total'];
            $courierOwes = $collected - $split['courier_amount'];

            $store = $order->store;
            $courier = $order->courier;

            // 2. goods → store
            $this->wallets->credit(
                $store->wallet(), $split['store_amount'], LedgerType::Goods, $order,
                ['part' => 'goods'],
            );

            // 3. delivery → courier earnings
            $this->wallets->credit(
                $courier->wallet(), $split['courier_amount'], LedgerType::Delivery, $order,
                ['part' => 'delivery'],
            );

            // 4. service → platform, then debit the platform-funded promo
            $platform = Wallet::platform();
            $this->wallets->credit($platform, $split['platform_amount'], LedgerType::Service, $order, ['part' => 'service']);
            if ($promo > 0) {
                $this->wallets->debit($platform, $promo, LedgerType::Promo, $order, ['part' => 'promo']);
            }

            // 5. cash the courier physically holds for the platform
            $courier->increment('cash_balance', $courierOwes);

            // 6b. settlement receipt
            $settlement = CashSettlement::create([
                'order_id' => $order->id,
                'courier_id' => $courier->id,
                'expected_amount' => $expected,
                'collected_amount' => $collected,
                'difference' => $collected - $expected,
                'store_amount' => $split['store_amount'],
                'courier_amount' => $split['courier_amount'],
                'platform_amount' => $split['platform_amount'],
                'promo_amount' => $promo,
                'courier_owes' => $courierOwes,
            ]);

            // 7. persist the split on the order + mark settled
            $order->update([
                'store_amount' => $split['store_amount'],
                'courier_amount' => $split['courier_amount'],
                'platform_amount' => $split['platform_amount'],
                'collected_amount' => $collected,
                'status' => OrderStatus::Settled,
                'settled_at' => now(),
            ]);

            return $settlement;
        });
    }
}
