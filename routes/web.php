<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//Usuários
Route::resource('user', 'Admin\UserController');
//Login
Route::get('login', function () {
    return view('login');
});
Route::get('reset', 'Auth\ResetPasswordController@index');

//Dashboard
Route::get('dashboard', 'DashboardController@index')->middleware('auth');

//Produtos
Route::resource('product', 'ProductController');

//other routes here
Route::get('/logout', 'Auth\LogoutController@logout');

Auth::routes(['register' => false]);


//Route::get('logout', 'Auth\LoginController@logout')


Route::get('/home', 'HomeController@index')->name('home');
