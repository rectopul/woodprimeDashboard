<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductCustomizationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_customizations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('customization_id')->unsigned()->nullable();
            $table->foreign('customization_id')->references('id')->on('customizations')->onDelete('set null');
            $table->unsignedBigInteger('product_id')->unsigned()->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_customizations');
    }
}
