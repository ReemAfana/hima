<?php

namespace App\Http\Controllers\Api\Host;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Contract;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // List all booking requests for host's properties
    public function index(Request $request)
    {
        $bookings = Booking::whereHas('property', function ($query) use ($request) {
                $query->where('host_id', $request->user()->id);
            })
            ->with('property:id,title,location', 'tenant:id,first_name,last_name,email,phone')
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    // Accept a booking request
    public function accept(Request $request, $id)
    {
        $booking = Booking::whereHas('property', function ($query) use ($request) {
                $query->where('host_id', $request->user()->id);
            })
            ->findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be accepted.',
            ], 403);
        }

        // Accept the booking
        $booking->update(['status' => 'accepted']);

        // Update property availability to booked
        $booking->property->update(['availability' => 'booked']);

        // Reject all other pending bookings for the same property
        $rejectedBookings = Booking::where('property_id', $booking->property_id)
            ->where('id', '!=', $booking->id)
            ->where('status', 'pending')
            ->get();

        foreach ($rejectedBookings as $rejected) {
            $rejected->update(['status' => 'rejected']);

            // Notify other tenants their booking was rejected
            NotificationService::send(
                $rejected->tenant_id,
                'Booking Request Rejected',
                'Your booking request for "' . $booking->property->title . '" was rejected because the property has been booked by another tenant.',
                'booking_rejected',
                $rejected->id
            );
        }

        // Auto-create contract
        $contract = Contract::create([
            'booking_id'  => $booking->id,
            'tenant_id'   => $booking->tenant_id,
            'host_id'     => $request->user()->id,
            'property_id' => $booking->property_id,
            'start_date'  => $booking->start_date,
            'end_date'    => $booking->end_date,
            'price'       => $booking->price,
            'status'      => 'active',
        ]);

        // Notify tenant their booking was accepted
        NotificationService::send(
            $booking->tenant_id,
            'Booking Request Accepted',
            'Your booking request for "' . $booking->property->title . '" has been accepted. Your contract is now active.',
            'booking_accepted',
            $booking->id
        );

        return response()->json([
            'message'  => 'Booking accepted and contract created.',
            'booking'  => $booking,
            'contract' => $contract,
        ]);
    }

    // Reject a booking request
    public function reject(Request $request, $id)
    {
        $booking = Booking::whereHas('property', function ($query) use ($request) {
                $query->where('host_id', $request->user()->id);
            })
            ->findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be rejected.',
            ], 403);
        }

        $booking->update(['status' => 'rejected']);

        // Notify tenant
        NotificationService::send(
            $booking->tenant_id,
            'Booking Request Rejected',
            'Your booking request for "' . $booking->property->title . '" has been rejected by the host.',
            'booking_rejected',
            $booking->id
        );

        return response()->json([
            'message' => 'Booking rejected.',
            'booking' => $booking,
        ]);
    }
}