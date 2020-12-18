<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LogoutController extends Controller
{
    public function Logout(){
        auth()->logout();

        session()->flash('message', 'Some goodbye message');

        return redirect(\Request::is('admin/*') ? '/admin/login' : '/login');
    }
}
