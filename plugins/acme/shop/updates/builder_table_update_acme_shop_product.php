<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProduct extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->text('props')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->dropColumn('props');
        });
    }
}
