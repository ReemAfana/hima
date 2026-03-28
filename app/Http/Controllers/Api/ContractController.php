<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    // List contracts based on role
    public function index(Request $request)
    {
        $user  = $request->user();
        $role  = $user->getRoleNames()->first();
        $query = Contract::with('property:id,title,location,type');

        if ($role === 'tenant') {
            $query->where('tenant_id', $user->id)
                  ->with('host:id,first_name,last_name,phone');
        } elseif ($role === 'host') {
            $query->where('host_id', $user->id)
                  ->with('tenant:id,first_name,last_name,phone');
        } elseif ($role === 'admin') {
            $query->with('tenant:id,first_name,last_name')
                  ->with('host:id,first_name,last_name');
        }

        $contracts = $query->latest()->get();

        return response()->json($contracts);
    }

    // View a single contract
    public function show(Request $request, $id)
    {
        $user     = $request->user();
        $role     = $user->getRoleNames()->first();
        $contract = Contract::with([
            'property:id,title,location,type',
            'tenant:id,first_name,last_name,phone',
            'host:id,first_name,last_name,phone',
            'booking:id,start_date,end_date,status',
        ])->findOrFail($id);

        // Access control
        if ($role === 'tenant' && $contract->tenant_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        if ($role === 'host' && $contract->host_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($contract);
    }

    // Cancel a contract
    public function cancel(Request $request, $id)
    {
        $user     = $request->user();
        $role     = $user->getRoleNames()->first();
        $contract = Contract::findOrFail($id);

        // Only tenant or host can cancel
        if ($role === 'tenant' && $contract->tenant_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        if ($role === 'host' && $contract->host_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($contract->status !== 'active') {
            return response()->json([
                'message' => 'Only active contracts can be cancelled.',
            ], 403);
        }

        // Cancel contract
        $contract->update(['status' => 'cancelled']);

        // Free up the property
        $contract->property->update(['availability' => 'available']);

        // Notify the other party
        if ($role === 'tenant') {
            // Notify host
            NotificationService::send(
                $contract->host_id,
                'Contract Cancelled',
                'The tenant has cancelled the contract for "' . $contract->property->title . '".',
                'contract_cancelled',
                $contract->id
            );
        } elseif ($role === 'host') {
            // Notify tenant
            NotificationService::send(
                $contract->tenant_id,
                'Contract Cancelled',
                'The host has cancelled the contract for "' . $contract->property->title . '".',
                'contract_cancelled',
                $contract->id
            );
        }

        return response()->json([
            'message'  => 'Contract cancelled successfully.',
            'contract' => $contract,
        ]);
    }

    // Admin archives old inactive contracts
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contract = Contract::findOrFail($id);

        if ($contract->status === 'active') {
            return response()->json([
                'message' => 'Cannot archive an active contract.',
            ], 403);
        }

        $contract->delete();

        return response()->json([
            'message' => 'Contract archived successfully.',
        ]);
    }
}