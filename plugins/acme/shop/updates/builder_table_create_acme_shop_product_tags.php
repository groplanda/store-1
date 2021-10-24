<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopProductTags extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_product_tags', function($table)
        {
            $table->engine = 'InnoDB';
            $table->smallInteger('product_id');
            $table->smallInteger('tag_id');
            $table->primary(['product_id','tag_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_product_tags');
    }
}
