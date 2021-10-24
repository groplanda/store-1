<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Brand;

class BrandList extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
          'name' => 'Список брендов',
          'description' => 'Показать все бренды'
      ];
    }

    public function onRun()
    {
      $this->page['brands'] = Brand::orderBy('sort_order', 'asc')->where('is_active', 1)->get();
    }
}