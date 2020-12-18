<?php

namespace App\Http\Controllers;

use App\Models\Type;
use App\Models\Customization;
use App\Models\User;
use App\Models\Product;
use App\Models\Option;
use App\Models\ProductCustomization;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        //Customizations
        $customizations = Customization::all();
        $customizationsCount = $customizations->count();

        //Types
        $types = Type::all();
        $count = $types->count();
        $users = User::get();
        $unrelated = Customization::whereNull('type_id')->get();
        $products = Product::with('options.option')->get();

        $customTypes = Type::with('customization')->get();

        // foreach ($customTypes as $customType) {
        //     $customType->setRelation('customization', $customType->customization()->paginate(10));
        // }

        //dd($types);
        return view('pages.dashboard.dashboard', compact('types', 'user', 'count', 'customTypes', 'customizationsCount', 'users', 'unrelated', 'products'));
    }
}
