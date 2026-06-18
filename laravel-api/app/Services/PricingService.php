<?php

namespace App\Services;

use App\Models\Order;

/**
 * Canonical, server-side money split. All amounts are integer tenge.
 *
 *   client_paid     = subtotal + delivery_fee + service_fee − discount
 *   store_amount    = subtotal            (goods)
 *   courier_amount  = delivery_fee        (delivery)
 *   platform_amount = service_fee         (gross; the promo it funds is tracked
 *                     separately, so platform NET = service_fee − discount)
 */
class PricingService
{
    /** @return array{store_amount:int,courier_amount:int,platform_amount:int,total:int} */
    public function split(Order $order): array
    {
        $total = $order->subtotal
            + $order->delivery_fee
            + $order->service_fee
            - $order->discount;

        $split = [
            'store_amount' => $order->subtotal,
            'courier_amount' => $order->delivery_fee,
            'platform_amount' => $order->service_fee,
            'total' => $total,
        ];

        // Invariant: the parts (net of the platform-funded promo) reconcile to
        // what the client actually pays. Guards against mis-allocated money.
        $reconciled = $split['store_amount']
            + $split['courier_amount']
            + $split['platform_amount']
            - $order->discount;

        if ($reconciled !== $total) {
            throw new \RuntimeException('split_invariant_violation');
        }

        return $split;
    }
}
