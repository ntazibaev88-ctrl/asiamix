<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case Kaspi = 'kaspi';
    case Card = 'card';
}
