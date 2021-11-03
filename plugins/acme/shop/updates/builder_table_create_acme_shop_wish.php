<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopWish extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_wish', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->integer('user_id')->nullable();
            $table->text('products')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_wish');
    }
}
