<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopCategories extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_categories', function($table)
        {
            $table->string('image')->nullable();
            $table->boolean('is_show')->nullable()->default(1);
            $table->string('title', 191)->nullable()->change();
            $table->string('slug', 191)->nullable()->change();
            $table->text('description')->nullable()->change();
            $table->integer('sort_order')->nullable()->change();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_categories', function($table)
        {
            $table->dropColumn('image');
            $table->dropColumn('is_show');
            $table->string('title', 191)->nullable(false)->change();
            $table->string('slug', 191)->nullable(false)->change();
            $table->text('description')->nullable(false)->change();
            $table->integer('sort_order')->nullable(false)->change();
        });
    }
}
