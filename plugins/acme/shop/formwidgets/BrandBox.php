<?php
namespace Acme\Shop\FormWidgets;

use Backend\Classes\FormWidgetBase;
use Config;
use Acme\Shop\Models\Brand;

class BrandBox extends FormWidgetBase
{
  public function widgetDetails() {
    return [
      'name' => 'Brandbox',
      'description' => 'add brand id',
    ];
  }

  public function prepareVars() {
    $this->vars['brands'] = Brand::lists('title', 'id');
    $this->vars['name'] = $this->formField->getName();
    $this->vars['selectedValue'] = $this->getLoadValue();
  }

  public function render() {
    $this->prepareVars();
    return $this->makePartial('widget');
  }
}
