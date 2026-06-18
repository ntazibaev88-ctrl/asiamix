<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Append-only journal. Every money movement writes one row; balances are
        // reconstructable by summing entries per wallet.
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders');
            $table->foreignId('wallet_id')->constrained('wallets');
            // goods | delivery | service | promo | cash_collected | cash_remittance | payout
            $table->string('type', 24);
            // credit | debit
            $table->string('direction', 8);
            $table->bigInteger('amount');        // always positive, tenge
            $table->bigInteger('balance_after');  // wallet balance after this line
            $table->jsonb('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['wallet_id', 'created_at']);
            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
    }
};
