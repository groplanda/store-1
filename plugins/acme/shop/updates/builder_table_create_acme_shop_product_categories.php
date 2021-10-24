<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopProductCategories extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_product_categories', function($table)
        {
            $table->engine = 'InnoDB';
            $table->smallInteger('product_id');
            $table->smallInteger('category_id');
            $table->primary(['product_id','category_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_product_categories');
    }
}
