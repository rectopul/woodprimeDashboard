<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddParentToProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        // Schema::table('products', function (Blueprint $table) {
        //     $table->integer('parent_id')->unsigned()->after('id')->nullable();
        // });
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_id')->unsigned()->nullable();
            $table->foreign('parent_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('parent_id');
        });
    }
}
