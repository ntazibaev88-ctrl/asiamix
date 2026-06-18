<?php

namespace App\Enums;

enum WalletOwner: string
{
    case Platform = 'platform';
    case Store = 'store';
    case Courier = 'courier';
}
