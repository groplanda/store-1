<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProductOptionValue extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product_option_value', function($table)
        {
            $table->integer('key')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product_option_value', function($table)
        {
            $table->dropColumn('key');
        });
    }
}
