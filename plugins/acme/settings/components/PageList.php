<?php namespace Acme\Settings\Components;

use Cms\Classes\ComponentBase;
use Acme\Settings\Models\Page;

class PageList extends ComponentBase
{
    public $pages;

    public function componentDetails()
    {
        return [
            'name'          => 'Статьи',
            'description'   => 'Отображение статей'
        ];
    }

    public function prepareVars()
    {
      $this->pages = Page::active()->orderBy('sort_order', 'asc')->get();
    }

    public function onRun()
    {
      $this->page['pages'] = $this->prepareVars();
    }

}