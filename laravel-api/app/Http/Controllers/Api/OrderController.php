<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderService $orders) {}

    /** Client creates an order; everything is priced server-side. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'store_id' => ['required', 'integer', 'exists:stores,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'payment_method' => ['nullable', 'in:cash,kaspi,card'],
            'promo_code' => ['nullable', 'string', 'max:32'],
            'address' => ['nullable', 'string'],
            'comment' => ['nullable', 'string'],
        ]);
        $data['client_id'] = $request->user()->id;

        $order = $this->orders->create($data);

        return response()->json($order, 201);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json($order->load(['items', 'store', 'courier.user']));
    }
}
