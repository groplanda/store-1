<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopBrands extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_brands', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('sort_order')->nullable()->default(0);
            $table->string('title')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_brands');
    }
}
