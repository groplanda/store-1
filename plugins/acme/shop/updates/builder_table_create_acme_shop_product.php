<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopProduct extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_product', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->string('title');
            $table->text('description');
            $table->string('image');
            $table->integer('price');
            $table->integer('sort_order')->default(0);
            $table->integer('sale_price');
            $table->boolean('is_active');
            $table->boolean('is_new');
            $table->boolean('is_hit');
            $table->string('code');
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_product');
    }
}
