<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Category;

class CategoryMenu extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
          'name' => 'Меню категорий',
          'description' => 'Показать меню'
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
              'options'     => ['default' => 'Главное', 'mobile' => 'Мобильное', 'footer' => 'Подвал']
            ]
        ];
    }

    public function onRender()
    {
      $view = $this->property('templateType');
      if($view == 'mobile') {
          return $this->renderPartial('@_mobile.htm');
      }
      if($view == 'footer') {
        return $this->renderPartial('@_footer.htm');
      }
    }

    public function onRun()
    {
      $view = $this->property('templateType');
      if($view == 'footer') {
        $this->page['menu'] = Category::select(['id', 'parent_id', 'title', 'slug'])->orderBy('sort_order', 'asc')->where([['is_show', 1], ['parent_id', null]])->get();
      } else {
        $this->page['menu'] = Category::select(['id', 'parent_id', 'title', 'slug'])->orderBy('sort_order', 'asc')->where([['is_show', 1], ['parent_id', null]])->withCount('products')->with(['children' => function($query) {
          $query->orderBy('sort_order', 'asc')->where('is_show', 1)->get(['id', 'parent_id', 'title', 'slug']);
        }])->get();
      }
    }
}