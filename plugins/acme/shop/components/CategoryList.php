<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Category;

class CategoryList extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
          'name' => 'Список категорий',
          'description' => 'Показать категории'
      ];
    }

    public function defineProperties()
    {
        return [
            'templateType' => [
              'title'       => 'Выбор',
              'type'        => 'dropdown',
              'default'     => 'default',
              'placeholder' => 'Выберите...',
              'options'     => ['default' => 'Страница каталога', 'homepage' => 'Главная страница']
            ]
        ];
    }

    public function onRender()
    {
        $view = $this->property('templateType');
        if($view == 'homepage') {
            return $this->renderPartial('@_homepage.htm');
        }
    }

    public function onRun()
    {
      $this->page['categories'] = Category::orderBy('sort_order', 'asc')->where([['is_show', 1], ['parent_id', null]])->withCount('products')->with(['children' => function($query) {
        $query->orderBy('sort_order', 'asc')->where('is_show', 1)->get(['id', 'parent_id', 'title', 'slug']);
      }])->get();
    }
}