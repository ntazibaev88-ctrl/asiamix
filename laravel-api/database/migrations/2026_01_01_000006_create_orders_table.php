<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code', 16)->unique(); // human-facing #
            $table->foreignId('client_id')->constrained('users');
            $table->foreignId('store_id')->constrained('stores');
            $table->foreignId('courier_id')->nullable()->constrained('couriers');
            $table->foreignId('promo_code_id')->nullable()->constrained('promo_codes');

            $table->string('status', 16)->default('pending');
            $table->string('payment_method', 16)->default('cash');

            // ── money breakdown (all integer tenge) ──
            $table->bigInteger('subtotal');          // goods
            $table->bigInteger('delivery_fee')->default(0);
            $table->bigInteger('service_fee')->default(0);
            $table->bigInteger('discount')->default(0); // promo
            $table->bigInteger('total');             // client pays

            // ── split (filled at settlement) ──
            $table->bigInteger('store_amount')->default(0);
            $table->bigInteger('courier_amount')->default(0);
            $table->bigInteger('platform_amount')->default(0);

            // cash the courier actually collected (cash orders)
            $table->bigInteger('collected_amount')->nullable();

            $table->decimal('weight_kg', 8, 3)->default(0);
            $table->string('address')->nullable();
            $table->text('comment')->nullable();

            $table->timestamp('settled_at')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index(['courier_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
