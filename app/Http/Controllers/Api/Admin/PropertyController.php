<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    // List all properties (all statuses)
    public function index()
    {
        $properties = Property::with('host:id,first_name,last_name,email')
            ->latest()
            ->get();

        return response()->json($properties);
    }

    // List pending properties only
    public function pending()
    {
        $properties = Property::with('host:id,first_name,last_name,email')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json($properties);
    }

    // Accept a property
    public function accept($id)
    {
        $property = Property::findOrFail($id);

        if ($property->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending properties can be accepted.',
            ], 403);
        }

        $property->update([
            'status'           => 'accepted',
            'availability'     => 'available',
            'rejection_reason' => null,
        ]);

        return response()->json([
            'message'  => 'Property accepted and is now live.',
            'property' => $property,
        ]);
    }

    // Reject a property
    public function reject(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        if ($property->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending properties can be rejected.',
            ], 403);
        }

        $data = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $property->update([
            'status'           => 'rejected',
            'availability'     => 'not_available',
            'rejection_reason' => $data['rejection_reason'],
        ]);

        return response()->json([
            'message'  => 'Property rejected.',
            'property' => $property,
        ]);
    }

    // Archive (soft delete) a violating property
    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        if ($property->availability === 'booked') {
            return response()->json([
                'message' => 'Cannot delete a booked property.',
            ], 403);
        }

        $property->delete();

        return response()->json([
            'message' => 'Property archived successfully.',
        ]);
    }
}