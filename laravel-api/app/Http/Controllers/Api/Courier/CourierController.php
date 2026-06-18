<?php

namespace App\Http\Controllers\Api\Courier;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\CashSettlement;
use App\Models\Order;
use App\Services\CashSettlementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Courier panel API. The courier never sees commission / platform figures —
 * only what they need: the pool, their assigned orders, weight, addresses, and
 * the cash-settlement action.
 */
class CourierController extends Controller
{
    public function __construct(private CashSettlementService $settlement) {}

    private function courier(Request $request)
    {
        $courier = $request->user()->courier;
        abort_if(! $courier, 403, 'not_a_courier');

        return $courier;
    }

    /** Available pool — orders ready for pickup, no courier yet. */
    public function pool(Request $request): JsonResponse
    {
        $jobs = Order::whereNull('courier_id')
            ->whereIn('status', [OrderStatus::Pending->value, OrderStatus::Ready->value])
            ->with(['store:id,name,address,lat,lng', 'items:id,order_id,name,qty,weight_kg'])
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (Order $o) => $this->courierView($o));

        return response()->json($jobs);
    }

    /** Courier's own orders. */
    public function myOrders(Request $request): JsonResponse
    {
        $courier = $this->courier($request);
        $orders = Order::where('courier_id', $courier->id)
            ->with(['store:id,name,address', 'items:id,order_id,name,qty,weight_kg'])
            ->latest()
            ->get()
            ->map(fn (Order $o) => $this->courierView($o));

        return response()->json($orders);
    }

    /** Take an order (assign + mark on the way). */
    public function accept(Request $request, Order $order): JsonResponse
    {
        $courier = $this->courier($request);
        abort_if($order->courier_id, 409, 'already_taken');

        $order->update([
            'courier_id' => $courier->id,
            'status' => OrderStatus::OnTheWay,
        ]);

        return response()->json($this->courierView($order->fresh(['store', 'items'])));
    }

    /**
     * Close a CASH order: the courier enters the cash collected, the system
     * auto-splits the money and updates the courier cash drawer + balances.
     */
    public function close(Request $request, Order $order): JsonResponse
    {
        $courier = $this->courier($request);
        abort_if($order->courier_id !== $courier->id, 403, 'not_your_order');

        $data = $request->validate([
            'collected_amount' => ['required', 'integer', 'min:0'],
        ]);

        $settlement = $this->settlement->settle($order, $data['collected_amount']);

        return response()->json([
            'ok' => true,
            'order' => $order->fresh(),
            'settlement' => $settlement,
            'courier_cash_balance' => $courier->fresh()->cash_balance,
        ]);
    }

    /** Cash drawer + earnings balance + settlement history. */
    public function balance(Request $request): JsonResponse
    {
        $courier = $this->courier($request);
        $wallet = $courier->wallet();

        $history = CashSettlement::where('courier_id', $courier->id)
            ->latest('created_at')
            ->limit(50)
            ->get();

        return response()->json([
            'cash_balance' => $courier->cash_balance,   // owed to platform
            'earnings_balance' => $wallet->balance,      // courier's own money
            'settlements' => $history,
        ]);
    }

    /** Courier-safe view of an order — NO price/commission, only logistics. */
    private function courierView(Order $o): array
    {
        return [
            'id' => $o->id,
            'code' => $o->code,
            'status' => $o->status,
            'payment_method' => $o->payment_method,
            'store' => [
                'name' => $o->store?->name,
                'address' => $o->store?->address,
            ],
            'delivery_address' => $o->address,
            'weight_kg' => (float) $o->weight_kg,
            'items_count' => $o->items->sum('qty'),
            'bags' => max(1, (int) ceil($o->items->sum('qty') / 6)),
            'lines' => $o->items->map(fn ($i) => [
                'name' => $i->name,
                'qty' => $i->qty,
            ]),
            // For cash orders the courier needs the amount to collect.
            'collect_amount' => $o->payment_method->value === 'cash' ? $o->total : 0,
        ];
    }
}
