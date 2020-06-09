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
//Options
Route::resource('option', 'OptionController');
//Users
Route::resource('user', 'UserController');


//types of customization
Route::resource('type', 'TypeController');

//Search customizations
Route::get('/custon/search/{find}', 'CustomizationController@find')->name('findcustom');
