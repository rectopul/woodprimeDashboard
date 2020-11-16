<?php

namespace App\Http\Controllers;

use App\Models\Customization;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductOption;
use Illuminate\Http\Request;

class OptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $custonId = $request->query('custom');
        if ($custonId) {
            $custom = Customization::where('id', $custonId)->with('options')->first();
            //$options = Option::get();

            return response()->json($custom);
        }

        $options = Option::with('customization')->get();

        return response()->json($options);
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
        //Create new type
        $option = new Option;

        $option->customization_id = $request->input('customization_id');
        $option->name = $request->input('name');
        $option->image = $request->input('image');
        $option->price = $request->input('price');


        $option->save();

        //response this request
        return response()->json($option);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $option = Option::where('id', $id)->with('custom')->first();

        return response()->json($option);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $option = Option::find($id);

        return response()->json($option);
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
        $option = Option::find($id);

        $option->name = $request->input('name');
        $option->image = $request->input('image');

        $option->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $res = Option::where('id', $id)->delete();
        return response()->json($res);
    }
}
