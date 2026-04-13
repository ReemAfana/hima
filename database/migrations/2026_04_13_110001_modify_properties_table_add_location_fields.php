<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::table('properties', function (Blueprint $table) {
        // Remove old location field
        $table->dropColumn('location');

        // Add new fields
        $table->foreignId('governorate_id')->nullable()->constrained('governorates')->onDelete('set null');
        $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
        $table->string('neighborhood')->nullable();
        $table->string('street')->nullable();
        });
    }

public function down(): void
    {
    Schema::table('properties', function (Blueprint $table) {
        $table->dropForeign(['governorate_id']);
        $table->dropForeign(['city_id']);
        $table->dropColumn(['governorate_id', 'city_id', 'neighborhood', 'street']);
        $table->string('location')->nullable();
        });
    }
};
