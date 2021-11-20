<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Product;

class SpecialProducts extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
          'name' => 'Товары по акции',
          'description' => 'Показать товары по акции'
      ];
    }

    public function onRun()
    {
      $this->page['special'] = Product::select('id','title','slug','image','price','sale_price','description','is_new','is_hit')
                                        ->orderBy('sort_order', 'asc')
                                        ->where([['is_active', 1], ['is_hit', 1]])
                                        ->with(['options'])
                                        ->get();
    }
}