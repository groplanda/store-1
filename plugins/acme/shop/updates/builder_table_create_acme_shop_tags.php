<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopTags extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_tags', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->string('title');
            $table->integer('sort_order')->default(0);
            $table->string('slug');
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_tags');
    }
}
