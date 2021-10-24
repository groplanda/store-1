<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableDeleteAcmeShopPromocodeCategories extends Migration
{
    public function up()
    {
        Schema::dropIfExists('acme_shop_promocode_categories');
    }
    
    public function down()
    {
        Schema::create('acme_shop_promocode_categories', function($table)
        {
            $table->engine = 'InnoDB';
            $table->smallInteger('promocode_id');
            $table->smallInteger('category_id');
            $table->primary(['promocode_id','category_id']);
        });
    }
}
