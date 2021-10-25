<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopProductFeatured extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_product_featured', function($table)
        {
            $table->engine = 'InnoDB';
            $table->integer('product_id');
            $table->integer('featured_id');
            $table->primary(['product_id','featured_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_product_featured');
    }
}
