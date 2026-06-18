<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';       // created, awaiting store
    case Accepted = 'accepted';     // store accepted, preparing
    case Ready = 'ready';           // ready for pickup
    case OnTheWay = 'on_the_way';   // courier en route
    case Delivered = 'delivered';   // delivered, awaiting settlement
    case Settled = 'settled';       // money split + journaled
    case Cancelled = 'cancelled';
}
