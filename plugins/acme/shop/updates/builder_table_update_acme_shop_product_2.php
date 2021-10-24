<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProduct2 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->integer('comment_id')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->dropColumn('comment_id');
        });
    }
}
