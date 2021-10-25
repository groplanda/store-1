<?php
namespace Acme\Shop\FormWidgets;

use Backend\Classes\FormWidgetBase;
use Config;
use Acme\Shop\Models\Product;

class FeaturedBox extends FormWidgetBase
{
  public function widgetDetails() {
    return [
      'name' => 'FeaturedBox',
      'description' => 'add featured',
    ];
  }

  public function prepareVars() {
    $id = $this->model->id;
    $this->vars['products'] = Product::where('id', '!=', $id)->lists('title', 'id');
    $this->vars['name'] = $this->formField->getName().'[]';

    if (!empty($this->getLoadValue())) {
      $this->vars['selectedValue'] = $this->getLoadValue();
    } else {
      $this->vars['selectedValue'] = [];
    }
  }

  public function render() {
    $this->prepareVars();
    return $this->makePartial('widget');
  }

  public function loadAssets()
  {
    $this->addCss('css/select2.min.css');
    $this->addJs('js/select2.min.js');
  }

}
