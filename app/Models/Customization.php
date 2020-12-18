<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Option;

class Customization extends Model
{
    protected $fillable = ['type_id', 'name', 'description', 'order'];

    public function type()
    {
        return $this->belongsTo('App\Models\Type');
    }
    public function products()
    {
        return $this->hasMany('App\Models\ProductCustomization');
    }
    public function options()
    {
        return $this->hasMany(Option::class);
    }
}
