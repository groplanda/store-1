<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Brand;

class SingleBrand extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
          'name' => 'Одиночный бренд',
          'description' => 'Показать бренд'
      ];
    }

    public function onRun()
    {
      $id = $this->param('id');

      $brand = Brand::where('id', $id)->with(['products' => function($query) {
        $query->select(['id', 'title', 'slug', 'image', 'sale_price', 'price', 'brand_id'])->where('is_active', 1)->get();
      }])->withCount('products')->first();

      $this->page->title = $brand->title;
      // $this->page->meta_title = $brand->meta_title;
      // $this->page->meta_description = $brand->meta_description;
      $this->page['brand'] = $brand;
      $this->page['countLabel'] = $this->choseWordForm($brand->products_count, 'товар', 'товара', 'товаров');
    }

    private function choseWordForm(int $count, string $form1, string $form2, string $form5) {
      $count = abs($count) % 100;
      $count1 = $count % 10;
      if ($count > 10 && $count < 20) return $form5;
      if ($count1 > 1 && $count1 < 5) return $form2;
      if ($count1 == 1) return $form1;
      return $form5;
    }
}