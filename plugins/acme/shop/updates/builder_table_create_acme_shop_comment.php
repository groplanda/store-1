<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopComment extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_comment', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('star')->nullable();
            $table->integer('product_id')->nullable();
            $table->boolean('status')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_comment');
    }
}
