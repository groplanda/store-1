<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopOrders extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_orders', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('ip')->nullable();
            $table->string('title')->nullable();
            $table->text('products')->nullable();
            $table->string('status')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_phone')->nullable();
            $table->string('user_mail')->nullable();
            $table->string('user_address')->nullable();
            $table->string('user_comment')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_orders');
    }
}
