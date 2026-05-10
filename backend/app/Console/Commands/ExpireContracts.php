<?php

namespace App\Console\Commands;

use App\Models\Contract;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpireContracts extends Command
{
    protected $signature   = 'contracts:expire';
    protected $description = 'Automatically expire contracts that have passed their end date';

    public function handle()
    {
        $today = Carbon::today();

        $expiredContracts = Contract::where('status', 'active')
            ->where('end_date', '<', $today)
            ->get();

        foreach ($expiredContracts as $contract) {
            // Update contract status
            $contract->update(['status' => 'expired']);

            // Free up the property
            $contract->property->update(['availability' => 'available']);

            // Notify tenant
            NotificationService::send(
                $contract->tenant_id,
                'Contract Expired',
                'Your contract for "' . $contract->property->title . '" has expired.',
                'contract_expired',
                $contract->id
            );

            // Notify host
            NotificationService::send(
                $contract->host_id,
                'Contract Expired',
                'The contract for "' . $contract->property->title . '" has expired.',
                'contract_expired',
                $contract->id
            );

            // Send review reminder to both parties
            NotificationService::send(
                $contract->tenant_id,
                'Review Reminder',
                'Your contract has ended. Please take a moment to review your experience.',
                'review_reminder',
                $contract->id
            );

            NotificationService::send(
                $contract->host_id,
                'Review Reminder',
                'Your contract has ended. Please take a moment to review the tenant.',
                'review_reminder',
                $contract->id
            );
        }

        $this->info("Expired {$expiredContracts->count()} contracts.");
    }
}