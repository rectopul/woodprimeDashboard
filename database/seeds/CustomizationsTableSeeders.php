<?php

use App\Models\Customization;
use Illuminate\Database\Seeder;

class CustomizationsTableSeeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Customization::class, 30)->create();
    }
}
