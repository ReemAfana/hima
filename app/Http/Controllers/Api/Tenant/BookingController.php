<?php

namespace App\Http\Controllers\Api\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // List all bookings for the tenant
    public function index(Request $request)
    {
        $bookings = Booking::where('tenant_id', $request->user()->id)
            ->with('property:id,title,location,type,price')
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    // Submit a booking request
    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'start_date'  => 'required|date|after_or_equal:today',
            'end_date'    => 'required|date|after:start_date',
        ]);

        $property = Property::findOrFail($data['property_id']);

        // Only available properties can be booked
        if ($property->status !== 'accepted' || $property->availability !== 'available') {
            return response()->json([
                'message' => 'This property is not available for booking.',
            ], 403);
        }

        // Prevent duplicate pending booking by same tenant
        $exists = Booking::where('tenant_id', $request->user()->id)
            ->where('property_id', $data['property_id'])
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'You already have a pending booking request for this property.',
            ], 403);
        }

        $booking = Booking::create([
            'tenant_id'   => $request->user()->id,
            'property_id' => $data['property_id'],
            'start_date'  => $data['start_date'],
            'end_date'    => $data['end_date'],
            'price'       => $property->price,
            'status'      => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking request submitted successfully.',
            'booking' => $booking,
        ], 201);
    }

    // View a single booking
    public function show(Request $request, $id)
    {
        $booking = Booking::where('tenant_id', $request->user()->id)
            ->with('property:id,title,location,type,price')
            ->findOrFail($id);

        return response()->json($booking);
    }

    // Edit a pending booking
    public function update(Request $request, $id)
    {
        $booking = Booking::where('tenant_id', $request->user()->id)
            ->findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be edited.',
            ], 403);
        }

        $data = $request->validate([
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date'   => 'sometimes|date|after:start_date',
        ]);

        $booking->update($data);

        return response()->json([
            'message' => 'Booking updated successfully.',
            'booking' => $booking,
        ]);
    }

    // Cancel a pending booking
    public function cancel(Request $request, $id)
    {
        $booking = Booking::where('tenant_id', $request->user()->id)
            ->findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be cancelled.',
            ], 403);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Booking cancelled successfully.',
        ]);
    }
}