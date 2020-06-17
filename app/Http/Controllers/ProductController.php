<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductOption;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::paginate();

        return $products;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $check = Product::where('name', '=', $request->input('name'))->count();

        if ($check > 0) {
            return response()->json(['error' => 'This product name already exist'], 400);
        }

        $product = new Product;
        $product->name = $request->input('name');
        $product->description = $request->input('description');
        $product->image = $request->input('image');

        $product->save();

        $options = $request->input('options');

        foreach ($options as $key => $option) {
            $productCustomization = new ProductOption;
            $productCustomization->option_id = $option;
            $productCustomization->product_id = $product->id;

            //Save Custom
            $productCustomization->save();
        }

        return response()->json($product);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
