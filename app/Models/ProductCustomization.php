<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCustomization extends Model
{
    protected $fillable = ['customization_id', 'product_id'];

    public function custom()
    {        
        return $this->belongsTo('App\Models\Customization');
    }
    public function product()
    {        
        return $this->belongsTo('App\Models\Product');
    }
}
