<?php

namespace App\Models;

use App\Models\Customization;
use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    protected $fillable = ['name'];

    public function customization()
    {
        return $this->hasMany(Customization::class, $foreignKey = 'type_id', $localKey = 'id');
    }
}
