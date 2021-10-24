<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Product;

class PopularProducts extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
          'name' => 'Популярные товары',
          'description' => 'Показать популярные товары'
      ];
    }

    public function onRun()
    {
      $this->page['populars'] = Product::select('id','title','slug','image','price','sale_price','is_new','is_hit')->orderBy('sort_order', 'asc')->where([['is_active', 1], ['is_hit', 1]])->limit(8)->get();
    }
}