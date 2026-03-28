<?php

namespace App\Http\Controllers\Api\Host;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Contract;
use App\Models\Property;
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
        Booking::where('property_id', $booking->property_id)
            ->where('id', '!=', $booking->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

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

        return response()->json([
            'message' => 'Booking rejected.',
            'booking' => $booking,
        ]);
    }
}