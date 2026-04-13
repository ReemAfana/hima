<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Governorate;

class LocationController extends Controller
{
    // Get all governorates
    public function governorates()
    {
        return response()->json(Governorate::all());
    }

    // Get cities by governorate
    public function cities($governorateId)
    {
        $cities = City::where('governorate_id', $governorateId)->get();
        return response()->json($cities);
    }
}