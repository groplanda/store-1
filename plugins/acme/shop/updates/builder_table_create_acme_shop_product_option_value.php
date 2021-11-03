<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopProductOptionValue extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_product_option_value', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('product_id')->nullable();
            $table->integer('option_id')->nullable();
            $table->integer('option_value_id')->nullable();
            $table->integer('price')->nullable();
            $table->integer('sale_price')->nullable();
            $table->integer('quantity')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_product_option_value');
    }
}
