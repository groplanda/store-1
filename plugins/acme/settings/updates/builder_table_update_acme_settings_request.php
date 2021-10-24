<?php namespace Acme\Settings\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeSettingsRequest extends Migration
{
    public function up()
    {
        Schema::table('acme_settings_request', function($table)
        {
            $table->string('user_name', 191)->nullable();
            $table->string('user_phone', 191)->nullable();
            $table->string('user_subject', 191)->nullable();
            $table->string('user_mail', 191)->nullable();
            $table->renameColumn('message', 'user_message');
            $table->dropColumn('name');
            $table->dropColumn('phone');
            $table->dropColumn('subject');
            $table->dropColumn('mail');
        });
    }
    
    public function down()
    {
        Schema::table('acme_settings_request', function($table)
        {
            $table->dropColumn('user_name');
            $table->dropColumn('user_phone');
            $table->dropColumn('user_subject');
            $table->dropColumn('user_mail');
            $table->renameColumn('user_message', 'message');
            $table->string('name', 191)->nullable();
            $table->string('phone', 191)->nullable();
            $table->string('subject', 191)->nullable();
            $table->string('mail', 191)->nullable();
        });
    }
}
