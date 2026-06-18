<?php

namespace App\Enums;

enum Role: string
{
    case Client = 'client';
    case Store = 'store';
    case Courier = 'courier';
    case Admin = 'admin';
}
