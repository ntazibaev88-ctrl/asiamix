# NOMI Marketplace — Laravel API

Backend API for the **NOMI** marketplace (Flutter app + Laravel + PostgreSQL).
Four roles — **client · store · courier · admin** — with a server-side money
engine that splits every order between the store, the courier and the platform
and keeps a full double-entry-style journal.

> This is a standalone Laravel 11 service. It is independent from the Next.js
> demo in the repo root. Money is stored as **integer tenge (₸)** everywhere to
> avoid floating-point drift.

## Order money model

```
client_paid = subtotal + delivery_fee + service_fee − promo_discount

split:
  store_amount     = subtotal        → store wallet
  courier_amount   = delivery_fee    → courier earnings
  platform_amount  = service_fee     → platform wallet
  promo_discount   (platform-funded marketing cost)
```

Worked example (the one from the spec):

| part         | ₸     |
|--------------|-------|
| Тауар        | 4530  |
| Жеткізу      | 500   |
| Сервис сбор  | 200   |
| Промокод     | −450  |
| **Төлейді**  | **4780** |

Split → store `4530`, courier `500`, platform `200` (net `200 − 450 = −250`
once the promo it funded is accounted for).

## Cash settlement (наличный)

When a courier **closes** an order paid in cash they enter the amount collected.
`CashSettlementService` then, inside one DB transaction:

1. splits the order (`PricingService`),
2. credits the **store wallet** with the goods amount,
3. credits the **courier earnings** with the delivery fee,
4. credits the **platform wallet** with `service − promo`,
5. adds `collected − delivery` to the **courier cash drawer** (owed to platform),
6. writes a `ledger_entries` row for every movement + a `cash_settlements` row.

## Setup

```bash
composer install
cp .env.example .env            # set DB_CONNECTION=pgsql + credentials
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Structure

```
app/
  Enums/            Role, OrderStatus, PaymentMethod, WalletOwner, LedgerType
  Models/           User, Store, Courier, Product, PromoCode, Order,
                    OrderItem, Wallet, LedgerEntry, CashSettlement
  Services/         PricingService, WalletService, CashSettlementService
  Http/Controllers/Api/...
database/migrations/  PostgreSQL schema
routes/api.php        all endpoints
```

See `routes/api.php` for the full endpoint list (auth, orders, courier panel,
store balance, admin reports).
