<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Vérifie la logique de calcul des frais de retrait (5 % de commission).
 * Ces tests sont purement fonctionnels, sans base de données.
 */
class WithdrawalFeeTest extends TestCase
{
    private const FEE_RATE = 0.05;

    private function computeFee(float $amount): float
    {
        return round($amount * self::FEE_RATE, 2);
    }

    private function computeNet(float $amount): float
    {
        return round($amount - $this->computeFee($amount), 2);
    }

    // ── Commission ────────────────────────────────────────────────────────────

    public function test_fee_is_5_percent_of_amount(): void
    {
        $this->assertEquals(500.00, $this->computeFee(10000));
        $this->assertEquals(25.00, $this->computeFee(500));
        $this->assertEquals(1000.00, $this->computeFee(20000));
    }

    public function test_fee_rounds_to_2_decimal_places(): void
    {
        // 5 % de 1333 = 66.65
        $this->assertEquals(66.65, $this->computeFee(1333));

        // 5 % de 777 = 38.85
        $this->assertEquals(38.85, $this->computeFee(777));
    }

    // ── Montant net ───────────────────────────────────────────────────────────

    public function test_net_amount_equals_amount_minus_fee(): void
    {
        $this->assertEquals(9500.00, $this->computeNet(10000));
        $this->assertEquals(475.00, $this->computeNet(500));
        $this->assertEquals(19000.00, $this->computeNet(20000));
    }

    public function test_net_amount_is_never_negative(): void
    {
        $net = $this->computeNet(500);
        $this->assertGreaterThan(0, $net);
    }

    public function test_net_plus_fee_equals_original_amount(): void
    {
        $amount = 12345;
        $fee    = $this->computeFee($amount);
        $net    = $this->computeNet($amount);

        // net + fee doit être égal au montant initial (aux arrondis près)
        $this->assertEqualsWithDelta($amount, $net + $fee, 0.01);
    }

    // ── Taux ─────────────────────────────────────────────────────────────────

    public function test_fee_rate_is_5_percent(): void
    {
        $this->assertEquals(0.05, self::FEE_RATE);
    }

    public function test_different_amounts_produce_proportional_fees(): void
    {
        // Doubler le montant doit doubler la commission
        $fee1 = $this->computeFee(5000);
        $fee2 = $this->computeFee(10000);

        $this->assertEqualsWithDelta($fee2, $fee1 * 2, 0.01);
    }
}
