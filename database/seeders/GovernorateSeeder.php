<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Governorate;
use Illuminate\Database\Seeder;

class GovernorateSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'محافظة غزة' => [
                'مدينة غزة', 'الشجاعية', 'الرمال', 'التفاح', 'الزيتون',
                'الشيخ رضوان', 'النصر', 'الصبرة',
            ],
            'محافظة الشمال' => [
                'بيت لاهيا', 'بيت حانون', 'جباليا', 'عطاطرة',
                 'الشيخ زايد', 'كفر عدس',
            ],
            'محافظة خانيونس' => [
                'خانيونس', 'بني سهيلا', 'عبسان الكبيرة', 'عبسان الصغيرة',
                'خزاعة', 'القرارة', 'المنطقة الصناعية', 'حي النزهة',
            ],
            'محافظة رفح' => [
                'رفح', 'تل السلطان', 'حي البرازيل', 'حي الجنينة',
                'حي الشابورة', 'حي كندا', 'حي السويدي',
            ],
            'محافظة الوسطى' => [
                'دير البلح', 'النصيرات', 'البريج', 'المغازي',
                'الزوايدة', 
            ],
        ];

        foreach ($data as $governorateName => $cities) {
            $governorate = Governorate::create(['name' => $governorateName]);

            foreach ($cities as $cityName) {
                City::create([
                    'governorate_id' => $governorate->id,
                    'name'           => $cityName,
                ]);
            }
        }
    }
}