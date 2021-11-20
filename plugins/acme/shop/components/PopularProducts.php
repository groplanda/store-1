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
      $this->page['populars'] = Product::select('id','title','slug','image','price','sale_price','description','is_new','is_hit')
                                        ->orderBy('sort_order', 'asc')
                                        ->where([['is_active', 1], ['is_new', 1]])
                                        ->with(['options'])
                                        ->limit(12)
                                        ->get();
    }
}