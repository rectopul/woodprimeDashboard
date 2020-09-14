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

        $productOption = [];

        foreach ($products as $product) {
            $excluded = [];
            foreach ($product->options as $option) {
                $excluded[] = $option->option_id;
            }

            $productOption = Option::whereNotIn('id', $excluded)
                ->with('customization')->get();

            $product->custom = $productOption;
        }

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
        $check = Product::where('code', '=', $request->input('code'))->count();

        $excludes =  $request->input('excludes');

        $childs = $request->input('children');

        if (empty($excludes['custons'])) return response()->json(['error' => 'Selecione ao menos uma customização']);

        if ($check > 0) {
            $product = Product::where('code', '=', $request->input('code'))->first();

            //get all options in this custom
            $customizations = Option::whereNotIn('customization_id', $excludes['custons'])->get();

            //get all options if id has in list
            $exceptions = Option::whereIn('id', $excludes['options'])->get();

            $allExceptions = [];

            //merge all options
            foreach ($customizations as $custom) {
                $allExceptions[] = $custom;
            }

            foreach ($exceptions as $exception) {
                $allExceptions[] = $exception;
            }

            foreach ($allExceptions as $key => $thisOption) {
                //check
                $check = ProductOption::where('option_id', '=', $thisOption->id)->count();

                if ($check == 0) {
                    $productCustomization = new ProductOption;
                    $productCustomization->option_id = $thisOption->id;
                    $productCustomization->product_id = $product->id;

                    //Save Custom
                    $productCustomization->save();
                }

                //children

                foreach ($childs as $children) {

                    //create Product

                    //check if product exist 

                    $check_product = Product::where('name', '=', $children['name'])->first();

                    if ($check_product === null) {
                        $childrenProduct = new Product;
                        $childrenProduct->name = $children['name'];
                        $childrenProduct->description = $children['description'];
                        $childrenProduct->image = $children['image'];
                        $childrenProduct->code = $children['code'];
                        $childrenProduct->parent_id = $product->id;

                        $childrenProduct->save();

                        //option
                        $productCustomization = new ProductOption;
                        $productCustomization->option_id = $thisOption->id;
                        $productCustomization->product_id = $childrenProduct->id;

                        //Save Custom
                        $productCustomization->save();
                    } else {
                        //update children product
                        $check_product->name = $children['name'];
                        $check_product->description = $children['description'];
                        $check_product->image = $children['image'];
                        $check_product->code = $children['code'];
                        $check_product->parent_id = $product->id;
                        //option
                        $productCustomization = new ProductOption;
                        $productCustomization->option_id = $thisOption->id;
                        $productCustomization->product_id = $check_product->id;

                        //Save Custom
                        $productCustomization->save();
                        $check_product->save();
                    }
                }
            }

            $response = Product::where('code', '=', $request->input('code'))->with('options.option')->with('child')->first();

            return response()->json($response);
        }

        $product = new Product;
        $product->name = $request->input('name');
        $product->description = $request->input('description');
        $product->image = $request->input('image');
        $product->code = $request->input('code');

        $product->save();

        //get all options in this custom
        $customizations = Option::whereNotIn('customization_id', $excludes['custons'])->get();

        //get all options if id has in list
        $exceptions = Option::whereIn('id', $excludes['options'])->get();

        $allExceptions = [];

        //merge all options
        foreach ($customizations as $custom) {
            $allExceptions[] = $custom;
        }

        foreach ($exceptions as $exception) {
            $allExceptions[] = $exception;
        }


        //insert exclusions and children
        foreach ($allExceptions as $key => $thisOption) {
            $productCustomization = new ProductOption;
            $productCustomization->option_id = $thisOption->id;
            $productCustomization->product_id = $product->id;

            //Save Custom
            $productCustomization->save();

            foreach ($childs as $children) {

                $check_product = Product::where('name', '=', $children['name'])->first();


                //check if children exist
                if ($check_product === null) {

                    $childrenProduct = new Product;
                    $childrenProduct->name = $children['name'];
                    $childrenProduct->description = $children['description'];
                    $childrenProduct->image = $children['image'];
                    $childrenProduct->code = $children['code'];
                    $childrenProduct->parent_id = $product->id;

                    $childrenProduct->save();

                    //option insert options in exclusions
                    $productCustomization = new ProductOption;
                    $productCustomization->option_id = $thisOption->id;
                    $productCustomization->product_id = $childrenProduct->id;

                    //Save Custom
                    $productCustomization->save();
                } else {
                    //update-childrens
                    $check_product->name = $children['name'];
                    $check_product->description = $children['description'];
                    $check_product->image = $children['image'];
                    $check_product->code = $children['code'];
                    $check_product->parent_id = $product->id;
                    //option
                    $productCustomization = new ProductOption;
                    $productCustomization->option_id = $thisOption->id;
                    $productCustomization->product_id = $check_product->id;

                    //Save Custom
                    $check_product->save();
                    $productCustomization->save();
                }
            }
        }

        $response = Product::where('code', '=', $request->input('code'))->with('options.option')->with('child')->get();

        return response()->json($response);
    }
    public function excludeOption(Request $request)
    {
        $check = Product::where('id', '=', $request->input('product_id'))->first();

        if (!$check) {
            return response()->json(['error' => 'This product not exist'], 400);
        }

        $productCustomization = new ProductOption;
        $productCustomization->option_id = $request->input('option_id');
        $productCustomization->product_id = $request->input('product_id');

        //Save Custom
        $productCustomization->save();

        return response()->json($productCustomization);
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

        $products = Product::where('code', '=', $code)
            ->with('options')
            ->with('child')
            ->first();

        $messages['error']  = 'product not found';

        if (!$products)
            return response()->json($messages, 200);

        $customizations = Customization::with('type')->get();

        $excluded = [];
        $returned = [];


        foreach ($products->options as $option) {
            $excluded[] = $option->option_id;
        }

        //Get all options of not in excluded
        $productOption = Option::whereNotIn('id', $excluded)
            ->with('customization')->get();

        $products->custom = $productOption;

        //list customizations
        foreach ($customizations as $customization) {

            $options = [];

            foreach ($products->custom as $custom) {
                if ($custom->customization_id == $customization->id) {
                    $options[] = $custom;
                }
            }

            $customization->options = $options;

            if (!empty($options) && $customization->type_id > 1) $returned[] = $customization;
        }

        return response()->json(['custom' => $returned, 'child' => $products->child]);
    }

    /**
     * Get options by product id
     * in Shop Woodprime
     */
    public function show($id)
    {
        $products = Product::where('id', '=', $id)
            ->with('options')
            ->first();


        $excluded = [];

        foreach ($products->options as $option) {
            $excluded[] = $option->option_id;
        }

        $productOption = Option::whereNotIn('id', $excluded)
            ->with('customization.type')->get();

        $products->custom = $productOption;

        if ($products) {
            //return json_encode($productOption);
            return response()->json($products);
        }

        return response()->json('Product not exist', 200);
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
        $productOptions = ProductOption::where('product_id', $id)->get();

        foreach ($productOptions as $option) {
            $option->delete();
        }

        $res = Product::where('id', $id)->delete();

        return response()->json($productOptions);
    }
}
