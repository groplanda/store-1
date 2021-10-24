<?php namespace Acme\Settings\Components;

use Acme\Settings\Models\Slider;

class FullSlider extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Слайдер',
            'description' => 'Показать слайдер'
        ];
    }

    public function onRun()
    {
      $this->page['slider'] = Slider::orderBy('sort_order', 'asc')->get();
    }

}
