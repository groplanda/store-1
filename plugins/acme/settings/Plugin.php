<?php namespace Acme\Settings;

use System\Classes\PluginBase;
use Config;

class Plugin extends PluginBase
{
    public function registerComponents()
    {
      return [
        'Acme\Settings\Components\FullSlider' => 'FullSlider',
        'Acme\Settings\Components\PageList' => 'PageList',
        'Acme\Settings\Components\PageSingle' => 'PageSingle',
        'Acme\Settings\Components\ContactData' => 'ContactData',
        'Acme\Settings\Components\ContactModal' => 'ContactModal'
      ];
    }

    public function registerSettings()
    {
    }
}
