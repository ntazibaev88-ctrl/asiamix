<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminReportController extends Controller
{
    /** Platform-wide financial report (admin only). */
    public function index(): JsonResponse
    {
        $settled = Order::where('status', OrderStatus::Settled->value);

        return response()->json([
            'turnover' => (clone $settled)->sum('total'),
            'paid_to_stores' => (clone $settled)->sum('store_amount'),
            'paid_to_couriers' => (clone $settled)->sum('courier_amount'),
            'service_fees' => (clone $settled)->sum('platform_amount'),
            'promo_funded' => (clone $settled)->sum('discount'),
            // Platform net = service fees − promo it funded.
            'platform_profit' => (clone $settled)->sum('platform_amount')
                - (clone $settled)->sum('discount'),
            'platform_wallet' => Wallet::platform()->balance,
            'by_store' => (clone $settled)
                ->select('store_id', DB::raw('count(*) as orders'),
                    DB::raw('sum(store_amount) as payable'),
                    DB::raw('sum(platform_amount) as commission'))
                ->groupBy('store_id')->get(),
            'by_courier' => (clone $settled)
                ->whereNotNull('courier_id')
                ->select('courier_id', DB::raw('count(*) as deliveries'),
                    DB::raw('sum(courier_amount) as earnings'))
                ->groupBy('courier_id')->get(),
        ]);
    }
}
