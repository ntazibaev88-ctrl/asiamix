<?php

namespace App\Enums;

// Reason for each journal line. Keeps the ledger self-describing.
enum LedgerType: string
{
    case Goods = 'goods';            // → store
    case Delivery = 'delivery';      // → courier earnings
    case Service = 'service';        // → platform
    case Promo = 'promo';            // platform-funded discount (debit)
    case CashCollected = 'cash_collected'; // courier drawer in
    case CashRemittance = 'cash_remittance'; // courier hands cash to platform
    case Payout = 'payout';          // wallet → bank withdrawal
}
