<?php namespace Acme\Shop\Classes;

use Illuminate\Routing\Controller;
use Cms\Classes\Theme;
use RainLab\Pages\Classes\Router;

class Posts extends Controller {

  public $pageObject;
  public $title;
  public $content;

  public function getPost($name) {

    $router = new Router(Theme::getActiveTheme());
    $this->pageObject = $router->findByUrl("/post/$name");

    if($this->pageObject) {
      $this->title = array_get($this->pageObject->viewBag, 'title');
      $this->content = $this->pageObject->getProcessedMarkup();

      return response()->json(['title' => $this->title, 'content' => $this->content]);

    } else {
      return response()->json(['title' => '404', 'content' => 'Ничего не удалось найти!']);
    }

  }

}

