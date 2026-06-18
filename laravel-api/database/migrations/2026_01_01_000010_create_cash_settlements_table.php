<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // One row per cash order closed by a courier — the settlement receipt.
        Schema::create('cash_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('courier_id')->constrained('couriers');

            $table->bigInteger('expected_amount');   // what the client should pay
            $table->bigInteger('collected_amount');  // what the courier collected
            $table->bigInteger('difference');        // collected − expected

            $table->bigInteger('store_amount');      // goods → store
            $table->bigInteger('courier_amount');    // delivery kept by courier
            $table->bigInteger('platform_amount');   // service (gross)
            $table->bigInteger('promo_amount')->default(0);
            $table->bigInteger('courier_owes');      // collected − delivery → drawer

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_settlements');
    }
};
