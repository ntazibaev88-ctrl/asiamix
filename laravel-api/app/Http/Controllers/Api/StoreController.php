<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    private function store(Request $request)
    {
        $store = $request->user()->store;
        abort_if(! $store, 403, 'not_a_store');

        return $store;
    }

    /** Store available balance, total sales, commission withheld + history. */
    public function balance(Request $request): JsonResponse
    {
        $store = $this->store($request);

        $settled = Order::where('store_id', $store->id)
            ->where('status', OrderStatus::Settled->value);

        return response()->json([
            'available_balance' => $store->wallet()->balance,
            'total_sales' => (clone $settled)->sum('subtotal'),
            'commission' => (clone $settled)->sum('platform_amount'),
            'orders' => (clone $settled)->count(),
            'history' => (clone $settled)->latest('settled_at')->limit(50)
                ->get(['id', 'code', 'subtotal', 'platform_amount', 'store_amount', 'payment_method', 'settled_at']),
        ]);
    }
}
