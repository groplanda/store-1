<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Product;

class PopularProducts extends \Cms\Classes\ComponentBase
{

    public $title;
    public $products;

    public function componentDetails()
    {
      return [
          'name' => 'Слайдер товаров',
          'description' => 'Показать слайдер товаров'
      ];
    }

    public function defineProperties()
    {
        return [
          'productsType' => [
            'title'       => 'Выбор',
            'type'        => 'dropdown',
            'default'     => 'default',
            'placeholder' => 'Выберите...',
            'options'     => ['is_new' => 'Новинки', 'is_hit' => 'Хиты']
          ],
          'productsTitle' => [
            'title'       => 'Заголовок',
            'type'        => 'string',
            'placeholder' => 'Новинки',
          ]
        ];
    }

    public function onRun()
    {
      $type = $this->property('productsType');
      $this->title = $this->property('productsTitle');
      $this->products = $this->getProductsByType($type);
    }

    public function getProductsByType($type)
    {
      return Product::select('id','title','slug','image','price','sale_price','is_new','is_hit', 'code')
              ->orderBy('sort_order', 'asc')
              ->where([['is_active', 1], [$type, 1]])
              ->with(['options', 'categories'])
              ->limit(8)
              ->get();
    }
}
