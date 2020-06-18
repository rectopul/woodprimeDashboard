<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image', 'code'];
    public function product_customizations()
    {
        return $this->hasMany('App\Models\ProductCustomization');
    }
    public function options()
    {
        return $this->hasMany('App\Models\ProductOption');
    }
}
