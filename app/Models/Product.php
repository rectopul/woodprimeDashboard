<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image', 'code', 'parent_id'];
    public function product_customizations()
    {
        return $this->hasMany('App\Models\ProductCustomization');
    }
    public function options()
    {
        return $this->hasMany('App\Models\ProductOption');
    }

    public function child()
    {
        return $this->hasMany(Product::class, $foreignKey = 'parent_id', $localKey = 'id');
    }

    public function parent()
    {
        return $this->belongsTo(Product::class, $foreignKey = 'parent_id', $localKey = 'id');
    }
}
