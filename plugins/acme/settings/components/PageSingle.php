<?php namespace Acme\Settings\Components;

use Acme\Settings\Models\Page;
use Response;

class PageSingle extends \Cms\Classes\ComponentBase
{
    public $post;

    public function componentDetails()
    {
        return [
            'name' => 'Запись',
            'description' => 'Показать запись'
        ];
    }
    protected function prepareVars()
    {
        $slug = $this->param('slug');
        $query = Page::where('slug', '=', $slug)->first();

        if($query == null) {
            return Response::make($this->controller->run('404'), 404);
        }

        $this->post = $query;
        $this->page->title = $this->post->title;
        $this->page->meta_title = $this->post->meta_title;
        $this->page->meta_description  = $this->post->meta_description;

    }

    public function onRun() {
      $this->page['post'] = $this->prepareVars();
    }
}