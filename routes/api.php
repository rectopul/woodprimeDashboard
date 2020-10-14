<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//customizations
Route::resource('custon', 'CustomizationController');
//optionsByCustom
Route::get('custon/option/{id}', 'CustomizationController@options');
//Options
Route::resource('option', 'OptionController');
//Users
Route::resource('user', 'UserController');
//Poducts
Route::resource('product', 'ProductController');
//Product Option
Route::resource('product_option', 'ProductOptionController');
//Product Option
Route::get('product_search/{find}', 'ProductController@search');
//Get Option
Route::get('product_opt/{id}', 'ProductController@option');
//Exclude options
Route::post('product_opt', 'ProductController@excludeOption');


//types of customization
Route::resource('type', 'TypeController');

//Search customizations
Route::get('/custon/search/{find}', 'CustomizationController@find')->name('findcustom');
//Search customizations
Route::get('/custom/{id}', 'CustomizationController@get')->name('getCustom');
// nao associado
Route::get('custon/relate/index', 'CustomizationController@relate')->name('CustomUnrelated');
//get product in store
//Route::get('custon/option/{id}', 'CustomizationController@options');
Route::get('v1/product/{code}', 'ProductController@getOptions')->name('getOptions');
