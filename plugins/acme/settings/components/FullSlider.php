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

    public function defineProperties()
    {
      return [
          'templateSlider' => [
            'title'       => 'Выбор',
            'type'        => 'dropdown',
            'default'     => 'default',
            'placeholder' => 'Выберите...',
            'options'     => ['default' => 'Обычный', 'theme' => 'Вариант - 2']
          ]
      ];
    }

    public function onRender()
    {
      $view = $this->property('templateSlider');

      if($view == 'theme') {
        return $this->renderPartial('@_theme.htm');
      }
    }

    public function onRun()
    {
      $this->page['slider'] = Slider::orderBy('sort_order', 'asc')->get();
    }

}
