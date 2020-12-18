<?php

namespace App\Http\Controllers;

use App\Models\Customization;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductOption;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function option($id)
    {

        $products = ProductOption::where('product_id', '=', $id)->with('option')->get();
        $excluded = [];

        foreach ($products as $product) {
            $excluded[] = $product->option;
        }

        $theProduct = Option::whereNotIn('id', $excluded)->get();
        //$theProduct = Option::whereNotIn('id', $excluded)->get();


        return response()->json($theProduct);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request, $find)
    {
        $text = $find;

        $queryPaginate = $request->query('paginate');

        $products = Product::where('name', 'LIKE', "%{$text}%")
            ->orWhere('description', 'LIKE', "%{$text}%")
            ->orWhere('code', 'LIKE', "%{$text}%")
            ->with('options.option.customization')
            ->get();


        if ($products) {
            //return json_encode($productOption);
            return response()->json($products);
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
        $products = Product::with('options.option.customization')->get();

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
        $excludes = $request->input('excludes');
        $check = Product::where('code', '=', $request->input('code'))->first();

        //return response()->json($check->id, 400);

        //destroy all custom in this product
        if ($check) ProductOption::where('product_id', '=', $check->id)->delete();


        //Product
        $product;

        if ($check) {
            $check->name = $request->input('name');
            $check->description = $request->input('description');
            $check->image = $request->input('image');
            $check->code = $request->input('code');
            $check->save();

            $product = $check;
        } else {
            $product = new Product;
            $product->name = $request->input('name');
            $product->description = $request->input('description');
            $product->image = $request->input('image');
            $product->code = $request->input('code');

            $product->save();
        }


        //insert options in product
        foreach ($excludes['options'] as $option) {
            # code...
            $productCustomization = new ProductOption;
            $productCustomization->option_id = $option['id'];
            $productCustomization->product_id = $product->id;

            //Save Custom
            $productCustomization->save();
        }


        $childs = $request->input('children');

        //return response()->json($childs, 400);

        //clean childs
        foreach ($childs as $child) {


            $code = $child['code'];
            $description = $child['description'];
            $image = $child['image'];
            $name = $child['name'];

            $theChild = Product::where('code', '=', $code)->where('parent_id', '=', $product->id)->first();

            if ($theChild) {
                ProductOption::where('product_id', '=', $theChild->id)->delete();

                $theChild->name = $name;
                $theChild->description = $description;
                $theChild->image = $image ? $image : $request->input('image');
                $theChild->code = $code;
                $theChild->parent_id = $product->id;

                $theChild->save();

                //insert custons in children
                foreach ($excludes['options'] as $option) {
                    # code...
                    $productCustomization = new ProductOption;
                    $productCustomization->option_id = $option['id'];
                    $productCustomization->product_id = $theChild->id;

                    //Save Custom
                    $productCustomization->save();
                }
            } else {

                $children = new Product;
                $children->name = $name;
                $children->description = $description;
                $children->image = $image ? $image : $request->input('image');
                $children->code = $code;
                $children->parent_id = $product->id;

                $children->save();

                //insert custons in children
                foreach ($excludes['options'] as $option) {
                    # code...
                    $productCustomization = new ProductOption;
                    $productCustomization->option_id = $option['id'];
                    $productCustomization->product_id = $children->id;

                    //Save Custom
                    $productCustomization->save();
                }
            }
        }

        $response = Product::where('code', '=', $request->input('code'))->with('child')->with('options.option')->first();

        return response()->json($response);
    }

    public function excludeOption(Request $request)
    {
        $check = Product::where('id', '=', $request->input('product_id'))->first();

        if (!$check) {
            return response()->json(['error' => 'This product not exist'], 400);
        }

        $productOption = ProductOption::where('option_id', '=', $request->input('option_id'))
            ->where('product_id', '=', $request->input('product_id'));

        if (!empty($productOption)) {
            $productOption->delete();

            return response()->json($productOption);
        } else {
            return response()->json(['error' => 'produto não encontrado!'], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getOptions($code)
    {
        $messages = [];

        $product = Product::where('code', '=', $code)
            ->with('options')
            ->with('child')
            ->first();


        $messages['error']  = 'product not found';

        if (!$product)
            return response()->json($messages, 201);

        $product = $product->toArray();

        $theOptions = array_column($product['options'], 'option_id');

        //return response()->json($theOptions, 200);

        //get all custom
        $customizations = Customization::orderBy('order', 'ASC')
            ->with(['options' => function ($q) use ($theOptions) {
                return $q->whereIn('id', $theOptions)->with('customization');
            }])
            ->with('type')
            ->get()
            ->toArray();

        foreach ($customizations as $key => &$custom) {
            if (empty($custom['options']) || empty($custom['type_id'])) {
                array_splice($customizations, $key, 1);
            }
            unset($custom);
        }

        return response()->json(['custom' => $customizations, 'child' => $product['child']]);

        //$customClean = [];

        if (empty($product['options'])) {
            return response()->json(['custom' => [], 'child' => $product['child']]);
        }

        //list custons
        foreach ($customizations as $i => $custom) {

            //foreach options of this custom
            foreach ($customizations[$i]['options'] as $_i => &$option) {
                # code...
                if (!in_array($option['id'], array_column($product['options'], 'option_id'))) {
                    array_splice($customizations[$i]['options'], $_i, 1);
                    //unset($customizations[$i]['options'][$_i]);
                }

                unset($option);
            }
        }

        foreach ($customizations as $key => &$custom) {
            if (empty($custom['options']) || empty($custom['type_id'])) {
                array_splice($customizations, $key, 1);
            }
            unset($custom);
        }

        function search_array_compact($data, $key)
        {
            $compact = [];
            foreach ($data as $row) {
                if (!in_array($row[$key], $compact)) {
                    $compact[] = $row;
                }
            }
            return $compact;
        }

        foreach ($customizations as $key => &$custom) {
            if (empty($custom['options']) || empty($custom['type_id'])) {
                array_splice($customizations, $key, 1);
            }
            unset($custom);
        }

        $compactArray = search_array_compact($customizations, 'id');

        return response()->json(['custom' => $compactArray, 'child' => $product['child']]);
    }

    /**
     * Get options by product id
     * in Shop Woodprime
     */
    public function show($id)
    {
        $products = Product::where('id', '=', $id)
            ->with('options.option.customization.type')
            ->first();


        $excluded = [];

        if (!$products) return response()->json('Product not exist', 200);


        // foreach ($products->options as $option) {
        //     $excluded[] = $option->option_id;
        // }

        // $productOption = Option::whereIn('id', $excluded)->where('customization_id', '!=', null)
        //     ->with('customization.type')->get();

        // $products->custom = $productOption;

        return response()->json($products);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return response()->json('editar', 200);
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
        $options = $request->input('options');
        $excludes = $request->input('exclude');
        $product = $request->input('id');

        foreach ($excludes as $exclude) {
            $option = ProductOption::where('option_id', $exclude['id'])->where('product_id', $product);

            if ($option) $option->delete();
        }

        foreach ($options as $option) {

            //check if already exist
            $theOptions = ProductOption::where('option_id', '=', $option['id'])->where('product_id', $product);

            if ($theOptions->count()) {
            } else {
                # code...
                $productOption = new ProductOption;
                $productOption->option_id = $option['id'];
                $productOption->product_id = $product;

                //Save Custom
                $productOption->save();
            }
        }


        return response()->json($options, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $productOptions = ProductOption::where('product_id', $id)->get();

        foreach ($productOptions as $option) {
            $option->delete();
        }

        $res = Product::where('id', $id)->delete();

        return response()->json($productOptions);
    }
}
