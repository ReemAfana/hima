<?php

namespace App\Http\Controllers\Api\Host;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use App\Services\NotificationService;
class PropertyController extends Controller
{
    // List all properties belonging to the host
    public function index(Request $request)
    {
        $properties = Property::where('host_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($properties);
    }

    // Submit a new property
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'type'            => 'required|in:apartment,villa,land,chalet,commercial,parking',
            'governorate_id'  => 'required|exists:governorates,id',
            'city_id'         => 'required|exists:cities,id',
            'neighborhood'    => 'nullable|string|max:255',
            'street'          => 'nullable|string|max:255',
            'price'           => 'required|numeric|min:0',
            'area_m2'         => 'nullable|numeric|min:0',
            'rooms'           => 'nullable|integer|min:0',
            'damage_status'   => 'required|in:intact,partial,renovated',
            'has_water'       => 'boolean',
            'has_electricity' => 'boolean',
            'is_ready'        => 'boolean',
        ]);

        $property = Property::create([
            ...$data,
            'host_id'      => $request->user()->id,
            'status'       => 'pending',
            'availability' => 'not_available',
        ]);
        // Notify all admins
        $admins = \App\Models\User::role('admin')->get();
        foreach ($admins as $admin) {
            NotificationService::send(
                $admin->id,
                'New Property Submitted',
                'A new property "' . $property->title . '" has been submitted and requires your review.',
                'new_property_submitted',
                $property->id
            );
        }
        return response()->json([
            'message'  => 'Property submitted successfully. Waiting for admin approval.',
            'property' => $property,
        ], 201);
    }

    // View a single property
    public function show(Request $request, $id)
    {
        $property = Property::where('host_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($property);
    }

    // Edit a property
    public function update(Request $request, $id)
    {
        $property = Property::where('host_id', $request->user()->id)
            ->findOrFail($id);

        // Cannot edit if booked
        if ($property->availability === 'booked') {
            return response()->json([
                'message' => 'Cannot edit a booked property.',
            ], 403);
        }

        $data = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'type'            => 'sometimes|in:apartment,villa,land,chalet,commercial,parking',
            'governorate_id'  => 'sometimes|exists:governorates,id',
            'city_id'         => 'sometimes|exists:cities,id',
            'neighborhood'    => 'nullable|string|max:255',
            'street'          => 'nullable|string|max:255',
            'price'           => 'sometimes|numeric|min:0',
            'area_m2'         => 'nullable|numeric|min:0',
            'rooms'           => 'nullable|integer|min:0',
            'damage_status'   => 'sometimes|in:intact,partial,renovated',
            'has_water'       => 'boolean',
            'has_electricity' => 'boolean',
            'is_ready'        => 'boolean',
        ]);

        // Update essential fields to include location fields
        $essentialFields = ['title', 'type', 'governorate_id', 'city_id', 'price', 'damage_status'];

        // Reset to pending if essential data is changed
        $essentialFields = ['title', 'type', 'location', 'price', 'damage_status'];
        $hasEssentialChange = collect($essentialFields)->some(fn($f) => isset($data[$f]));

        if ($hasEssentialChange && $property->status === 'accepted') {
            $data['status']       = 'pending';
            $data['availability'] = 'not_available';
        }

        $property->update($data);
        // Notify all admins
        $admins = \App\Models\User::role('admin')->get();
        foreach ($admins as $admin) {
            NotificationService::send(
                $admin->id,
                'Property Modified',
                'The property "' . $property->title . '" has been modified and may require your review.',
                'property_modified',
                $property->id
            );
        }
        return response()->json([
            'message'  => 'Property updated successfully.',
            'property' => $property,
        ]);
    }

    // Toggle availability (available <-> not_available)
    public function toggleAvailability(Request $request, $id)
    {
        $property = Property::where('host_id', $request->user()->id)
            ->findOrFail($id);

        if ($property->status !== 'accepted') {
            return response()->json([
                'message' => 'Property must be accepted before changing availability.',
            ], 403);
        }

        if ($property->availability === 'booked') {
            return response()->json([
                'message' => 'Cannot change availability of a booked property.',
            ], 403);
        }

        $property->availability = $property->availability === 'available'
            ? 'not_available'
            : 'available';

        $property->save();

        return response()->json([
            'message'      => 'Availability updated.',
            'availability' => $property->availability,
        ]);
    }

    // Archive (soft delete) a property
    public function destroy(Request $request, $id)
    {
        $property = Property::where('host_id', $request->user()->id)
            ->findOrFail($id);

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