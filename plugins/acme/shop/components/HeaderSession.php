<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Wish;
use Auth;

class HeaderSession extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
        'name' => 'Сессия и избранное',
        'description' => 'Управление'
      ];
    }


    function prepareVars()
    {

      $user = $this->checkUser();

      if ($user) {
        $this->page['user'] = $user->id;
        $this->page['wish'] = $this->countWish($user->id);
      }
    }

    public function onRun()
    {
      $this->prepareVars();
    }

    public function onFeature()
    {
      $this->prepareVars();
    }

    private function checkUser() {
      if (!$user = Auth::getUser()) {
        return null;
      }
      if (!Auth::isImpersonator()) {
          $user->touchLastSeen();
      }
      return $user;
    }

    private function countWish($user_id) {
      $wish = Wish::where('user_id', $user_id)->first();
      $products = $wish->products;
      if(is_array($products)) {
        return count($products);
      }
      return 0;
    }
}