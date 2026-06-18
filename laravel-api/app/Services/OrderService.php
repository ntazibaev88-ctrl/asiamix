<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Order;
use App\Models\Product;
use App\Models\PromoCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Builds an order from a basket: prices everything SERVER-SIDE (never trusts
 * client amounts), applies the promo, and persists the order + items.
 */
class OrderService
{
    public function __construct(private DeliveryService $delivery) {}

    /**
     * @param  array<int,array{product_id:int,qty:int}>  $items
     */
    public function create(array $payload): Order
    {
        return DB::transaction(function () use ($payload) {
            $store = \App\Models\Store::findOrFail($payload['store_id']);
            $lines = [];
            $subtotal = 0;
            $weight = 0.0;

            foreach ($payload['items'] as $row) {
                /** @var Product $p */
                $p = Product::where('store_id', $store->id)
                    ->whereKey($row['product_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                $qty = max(1, (int) $row['qty']);
                $subtotal += $p->price * $qty;
                $weight += (float) $p->weight_kg * $qty;
                $lines[] = [
                    'product_id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'qty' => $qty,
                    'weight_kg' => $p->weight_kg,
                ];
            }

            $deliveryFee = $this->delivery->deliveryFee($weight);
            $serviceFee = $this->delivery->serviceFee($subtotal);

            // Promo (validated + priced server-side).
            $discount = 0;
            $promo = null;
            if (! empty($payload['promo_code'])) {
                $promo = PromoCode::where('code', strtoupper($payload['promo_code']))->first();
                if ($promo && $promo->isUsable($subtotal)) {
                    $discount = $promo->discountFor($subtotal, $deliveryFee);
                    $promo->increment('used_count');
                } else {
                    $promo = null;
                }
            }

            $total = $subtotal + $deliveryFee + $serviceFee - $discount;

            $order = Order::create([
                'code' => 'N' . strtoupper(Str::random(6)),
                'client_id' => $payload['client_id'],
                'store_id' => $store->id,
                'promo_code_id' => $promo?->id,
                'status' => OrderStatus::Pending,
                'payment_method' => $payload['payment_method'] ?? PaymentMethod::Cash->value,
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'service_fee' => $serviceFee,
                'discount' => $discount,
                'total' => $total,
                'weight_kg' => round($weight, 3),
                'address' => $payload['address'] ?? null,
                'comment' => $payload['comment'] ?? null,
            ]);

            $order->items()->createMany($lines);

            return $order->load('items');
        });
    }
}
