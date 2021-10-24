<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProduct3 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->string('slug', 255)->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->dropColumn('slug');
        });
    }
}
