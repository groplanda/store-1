<?php namespace Acme\Settings;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function registerComponents()
    {
      return [
        'Acme\Settings\Components\FullSlider' => 'FullSlider',
        'Acme\Settings\Components\PageList' => 'PageList',
        'Acme\Settings\Components\PageSingle' => 'PageSingle'
      ];
    }

    public function registerSettings()
    {
    }
}
