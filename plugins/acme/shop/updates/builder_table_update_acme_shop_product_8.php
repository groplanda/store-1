<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProduct8 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->string('meta_title', 255)->nullable();
            $table->string('meta_description', 255)->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->dropColumn('meta_title');
            $table->dropColumn('meta_description');
        });
    }
}
