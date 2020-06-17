<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOption extends Model
{
    protected $fillable = ['option_id', 'product_id'];

    public function option()
    {
        return $this->belongsTo('App\Models\OptionController');
    }
    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }
}
