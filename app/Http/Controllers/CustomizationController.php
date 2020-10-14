<?php

namespace App\Http\Controllers;

use App\Models\Customization;
use App\Models\Type;
use Illuminate\Http\Request;

class CustomizationController extends Controller
{
    /**
     * Display all unrelated values.
     *
     * @return \Illuminate\Http\Response
     */
    public function relate()
    {
        $unrelated = Customization::whereNull('type_id')->get();

        return response()->json($unrelated);
    }
    /**
     * Display all unrelated values.
     *
     * @return \Illuminate\Http\Response
     */
    public function relation($id)
    {
        $unrelated = Customization::whereNull('type_id')->get();

        return response()->json($unrelated);
    }

    /**
     * Get single custom
     */
    public function get($id)
    {
        $custom = Customization::find($id);

        if (empty($custom)) return response()->json(['error' => 'Customização não encontrada']);

        return response()->json($custom);
    }

    /**
     * Find or search custom
     * @return \Illuminate\Http\Response
     */
    public function find($find)
    {
        $text = $find;

        $custom = Customization::query()
            ->where('name', 'LIKE', "%{$text}%")
            ->orWhere('description', 'LIKE', "%{$text}%")->get();


        if ($custom) {
            return response()->json($custom);
        }

        return response()->json('', 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $custom = Customization::with('type')->get();


        if ($custom) {
            return response()->json($custom);
        }

        return response()->json('', 200);
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
        $order = $request->input('order');

        if (empty($order)) {
            return response()->json(['error' => 'Informe a ordem da customização']);
        }

        $custom = new Customization;
        $custom->name = $request->input('name');
        $custom->description = $request->input('description');
        $custom->type_id = $request->input('type_id');
        $custom->order = $request->input('order');

        $custom->save();

        $response = Customization::where('id', $custom->id)->with('type')->first();

        return response()->json($response);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $custom = Customization::where('id', $id)->with('type')->first();


        if ($custom) {
            return response()->json($custom);
        }

        return response()->json('', 200);
    }


    /**
     * Display all options by customization id.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function options($id)
    {
        $custom = Customization::where('id', $id)->with('options')->first();


        if ($custom) {
            return response()->json($custom);
        }

        return response()->json('', 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $id)
    {
        $custom = Customization::find($id);

        $custom->name = $request->input('name');
        $custom->description = $request->input('description');
        $custom->order = $request->input('order');
        $custom->type_id = $request->input('type_id');

        $custom->save();

        return response()->json($custom);
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
        $custom = Customization::find($id);

        $custom->name = $request->input('name');
        $custom->description = $request->input('description');
        $custom->order = $request->input('order');

        if (!empty($request->input('type_id'))) {
            $custom->type_id = $request->input('type_id');
        }

        $custom->save();

        return response()->json($custom);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $res = Customization::where('id', $id)->delete();
        return response()->json($res);
    }
}
