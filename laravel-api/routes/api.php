<?php

use App\Http\Controllers\Api\AdminReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Courier\CourierController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StoreController;
use Illuminate\Support\Facades\Route;

// ── Auth (phone + password, Sanctum bearer tokens) ──
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // ── Client orders ──
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // ── Courier panel ──
    Route::prefix('courier')->group(function () {
        Route::get('/pool', [CourierController::class, 'pool']);
        Route::get('/orders', [CourierController::class, 'myOrders']);
        Route::post('/orders/{order}/accept', [CourierController::class, 'accept']);
        Route::post('/orders/{order}/close', [CourierController::class, 'close']); // cash settlement
        Route::get('/balance', [CourierController::class, 'balance']);
    });

    // ── Store panel ──
    Route::get('/store/balance', [StoreController::class, 'balance']);

    // ── Admin reports ──
    Route::get('/admin/report', [AdminReportController::class, 'index'])
        ->middleware('ability:admin');
});
