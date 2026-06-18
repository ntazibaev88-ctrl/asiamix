<?php

namespace App\Services;

/**
 * Weight-based delivery pricing + flat-tier service fee (mirrors the client).
 *
 *   delivery = BASE (500₸) + weight surcharge:
 *     ≤7 кг → +0 · 8–14 → +300 · 15–20 → +400 · 20–30 → +600
 *
 *   service fee by goods subtotal:
 *     ≤2000 → 150 · ≤5000 → 200 · >5000 → 300
 */
class DeliveryService
{
    public int $base;

    public function __construct()
    {
        $this->base = (int) env('BASE_DELIVERY', 500);
    }

    public function deliveryFee(float $weightKg): int
    {
        return $this->base + $this->weightSurcharge($weightKg);
    }

    public function weightSurcharge(float $kg): int
    {
        return match (true) {
            $kg <= 7 => 0,
            $kg <= 14 => 300,
            $kg <= 20 => 400,
            default => 600,
        };
    }

    public function serviceFee(int $subtotal): int
    {
        return match (true) {
            $subtotal <= 0 => 0,
            $subtotal <= 2000 => 150,
            $subtotal <= 5000 => 200,
            default => 300,
        };
    }
}
