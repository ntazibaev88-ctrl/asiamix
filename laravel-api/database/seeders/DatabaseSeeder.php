<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\Role;
use App\Models\Courier;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use App\Services\CashSettlementService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        User::create(['name' => 'Admin', 'phone' => '+77000000001', 'password' => Hash::make('admin123'), 'role' => Role::Admin->value]);
        $client = User::create(['name' => 'Айгерим', 'phone' => '+77000000002', 'password' => Hash::make('client123'), 'role' => Role::Client->value]);
        $storeOwner = User::create(['name' => 'Asia Mix', 'phone' => '+77000000003', 'password' => Hash::make('store123'), 'role' => Role::Store->value]);
        $courierUser = User::create(['name' => 'Ерлан', 'phone' => '+77000000004', 'password' => Hash::make('courier123'), 'role' => Role::Courier->value]);

        $store = Store::create([
            'owner_id' => $storeOwner->id, 'name' => 'Asia Mix', 'slug' => 'asia-mix',
            'address' => 'Аль-Фараби 15/1', 'commission_rate' => 0,
        ]);
        $courier = Courier::create(['user_id' => $courierUser->id, 'available' => true]);

        // The worked example from the spec:
        //   goods 4530, delivery 500, service 200, promo 450 → client pays 4780.
        $order = Order::create([
            'code' => 'NDEMO01',
            'client_id' => $client->id,
            'store_id' => $store->id,
            'courier_id' => $courier->id,
            'status' => OrderStatus::Delivered->value,
            'payment_method' => PaymentMethod::Cash->value,
            'subtotal' => 4530,
            'delivery_fee' => 500,
            'service_fee' => 200,
            'discount' => 450,
            'total' => 4780,
            'weight_kg' => 3.2,
            'address' => 'Қабанбай батыр 11, кв. 52',
        ]);
        $order->items()->createMany([
            ['name' => 'Сүт 2.5% 1л', 'price' => 450, 'qty' => 2, 'weight_kg' => 1],
            ['name' => 'Нан', 'price' => 230, 'qty' => 1, 'weight_kg' => 0.4],
            ['name' => 'Тауық еті 1кг', 'price' => 2200, 'qty' => 1, 'weight_kg' => 1],
        ]);

        // Courier closes the order with cash collected → auto-split + journal.
        app(CashSettlementService::class)->settle($order, 4780);
    }
}
