<?php namespace Acme\Profile\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class AddUserFields extends Migration
{

    public function up()
    {
        Schema::table('users', function($table)
        {
            $table->string('entrance')->nullable();
            $table->string('flat')->nullable();
        });
    }

    public function down()
    {
      $table->dropDown([
        'entrance',
        'flat'
      ]);
    }

}
