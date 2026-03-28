<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    // Public listing with search & filtering
    public function index(Request $request)
    {
        $query = Property::public()->latest();

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by rooms
        if ($request->filled('rooms')) {
            $query->where('rooms', $request->rooms);
        }

        // Filter by area range
        if ($request->filled('min_area')) {
            $query->where('area_m2', '>=', $request->min_area);
        }
        if ($request->filled('max_area')) {
            $query->where('area_m2', '<=', $request->max_area);
        }

        // Filter by damage status
        if ($request->filled('damage_status')) {
            $query->where('damage_status', $request->damage_status);
        }

        // Filter by services
        if ($request->filled('has_water')) {
            $query->where('has_water', $request->boolean('has_water'));
        }
        if ($request->filled('has_electricity')) {
            $query->where('has_electricity', $request->boolean('has_electricity'));
        }

        // Filter by readiness
        if ($request->filled('is_ready')) {
            $query->where('is_ready', $request->boolean('is_ready'));
        }

        $properties = $query->get();

        return response()->json($properties);
    }

    // View a single public property
    public function show($id)
    {
        $property = Property::public()
            ->with('host:id,first_name,last_name')
            ->findOrFail($id);

        return response()->json($property);
    }
    // Generate WhatsApp contact link for a property
    public function whatsappLink($id)
    {
        $property = Property::public()
            ->with('host:id,first_name,last_name,phone')
            ->findOrFail($id);

        if (!$property->host->phone) {
            return response()->json([
                'message' => 'Host has no phone number listed.',
            ], 404);
        }

        // Build the auto message
        $message = "Hello, I found your property on Hima platform and I'm interested:\n\n"
            . "Property: {$property->title}\n"
            . "Location: {$property->location}\n"
            . "Price: {$property->price} per month\n"
            . "Type: {$property->type}\n\n"
            . "Can we discuss more details?";

        // Clean phone number and build WhatsApp link
        $phone = preg_replace('/[^0-9]/', '', $property->host->phone);
        $link  = 'https://wa.me/' . $phone . '?text=' . urlencode($message);

        return response()->json([
            'whatsapp_link' => $link,
            'host'          => $property->host->first_name . ' ' . $property->host->last_name,
            'phone'         => $property->host->phone,
        ]);
    }
}