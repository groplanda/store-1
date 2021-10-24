<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProduct4 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->integer('brand_id')->nullable()->default(0);
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->dropColumn('brand_id');
        });
    }
}
