<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DashBoard - @yield('title')</title>
    <script src="https://kit.fontawesome.com/0b8a3876f8.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="{{ asset('bootstrap-4.5.3-dist/dist/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.min.css') }}">
</head>

<body>
    <div class="container">
        @yield('content')
    </div>
    <div class="barload"></div>
    <!--Scripts -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="{{ asset('bootstrap-4.5.3-dist/dist/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('js/scripts.min.js') }}"></script>
</body>

</html>