<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopProductOption extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_product_option', function($table)
        {
            $table->engine = 'InnoDB';
            $table->smallInteger('product_id');
            $table->smallInteger('option_id');
            $table->primary(['product_id','option_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_product_option');
    }
}
