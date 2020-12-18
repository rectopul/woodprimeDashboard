<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Customization;
use Faker\Generator as Faker;

$factory->define(Customization::class, function (Faker $faker) {
    return [
        'type_id' => '4',
        'name' => $faker->unique()->word(),
        'description' => $faker->sentence()
    ];
});
