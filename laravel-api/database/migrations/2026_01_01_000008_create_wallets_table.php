<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            // platform | store | courier
            $table->string('owner_type', 16);
            // null for the single platform wallet; store_id / courier_id otherwise
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->bigInteger('balance')->default(0); // available, tenge
            $table->timestamps();

            $table->unique(['owner_type', 'owner_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
