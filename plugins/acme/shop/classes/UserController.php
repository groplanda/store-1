<?php

namespace Acme\Shop\Classes;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Validator;
use Auth;
use Event;
use Cookie;
use Session;
use Redirect;
use October\Rain\Auth\Manager;
use October\Rain\Auth\AuthException;
use RainLab\User\Components\Account;
use Acme\Shop\Models\Order;

class UserController extends Controller
{
  protected $sessionKey = 'user_auth';
  /**
   *
   *
   * @return Response
  */
  public function register(Request $request)
  {

    $rules = [
      'name'                  => 'required|min:3|max:50',
      'email'                 => 'required|email',
      'password'              => 'required|min:6',
      'password_confirmation' => 'required|same:password',
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'same'     => 'Пароли не совпадают',
      'min'      => 'Минимум :min символов!',
      'max'      => 'Максимум :max символов!',
      'email'    => 'Некорректный e-mail',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));
    }

    if ($this->getUserByLogin($request->get('email'))) {
      return response()->json(['status' => 'error', 'email' => ['Такой пользователь уже есть!']]);
    }
    $user = Auth::register([
      'name'                  => $request->get('name'),
      'email'                 => $request->get('email'),
      'password'              => $request->get('password'),
      'password_confirmation' => $request->get('password_confirmation'),
      'is_subscribe'          => $request->get('is_subscribe'),
    ], true);

    Auth::login($user, true);

    return response()->json(['status' => 'success', 'message' => $user]);

  }

  public function getUserByLogin($email)
  {
    return Auth::findUserByLogin($email);
  }

  /**
   *
   *
   * @return Response
  */
  public function auth(Request $request)
  {

    $rules = [
      'login' => 'required|email',
      'password' => 'required',
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'email'    => 'Некорректный e-mail',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));
    }

    if (!$user = $this->getUserByLogin($request->get('login'))) {
      return response()->json(['status' => 'error', 'login' => ['Пользователь не существует!']]);
    }

    if (!$user->checkHashValue('password', $request->get('password'))) {
      return response()->json(['status' => 'error', 'password' => ['Неверный логин или пароль']]);
    }

    $user = Auth::authenticate([
      'login'    => $request->get('login'),
      'password' => $request->get('password')
    ], true);

    return response()->json(array_merge(['status' => 'success', 'message' => $user]));
  }

  /**
   *
   *
   * @return Response
  */
  public function userdata() {
    if (Cookie::has($this->sessionKey)) {

      if (!$user = Auth::getUser()) {
        return null;
      }

      if (!Auth::isImpersonator()) {
          $user->touchLastSeen();
      }
      return response()->json((['status' => 'success', 'user' => $user]), 200);
    } else {
      return response()->json(null, 403);
    }
  }

  /**
   *
   *
   * @return Response
  */

  public function isUserLogin() {
    if (Cookie::has($this->sessionKey)) {

      if (!$user = Auth::getUser()) {
        return response()->json(false);
      }
      return response()->json(true);
    } else {
      return response()->json(false);
    }
  }

  public function logout() {
    Auth::logout();
    return response()->json((['status' => 'success']), 200);
  }

  public function userOrders() {
    if (!$user = Auth::getUser()) {
      return null;
    }
    $orders = Order::where('user_id', $user->id)->select('id', 'user_id', 'name', 'created_at', 'products', 'status', 'user_payment')->get();
    return response()->json((['status' => 'success', 'message' => $orders]), 200);
  }

  /**
   *
   *
   * @return Response
  */
  public function userEdit(Request $request) {

    $rules = [
      'name'    => 'required|min:3|max:50',
      'email'   => 'required|email',
      'surname' => 'max:50',
      'phone' => 'min:3|max:50',
      'address' => 'max:100'
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'same'     => 'Пароли не совпадают',
      'min'      => 'Минимум :min символов!',
      'max'      => 'Максимум :max символов!',
      'email'    => 'Некорректный e-mail',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));
    }

    if (!$user = $this->getUserByLogin($request->get('email'))) {
      return;
    }

    $user->fill($request->all());
    $user->save();

    return response()->json((['status' => 'success', 'message' => 'Пользователь обновлен!']), 200);
  }

   /**
   *
   *
   * @return Response
  */
  public function userChangePassword(Request $request) {
    $rules = [
      'email'                 => 'required|email',
      'current_password'      => 'required',
      'password'              => 'required|min:6',
      'password_confirmation' => 'required|same:password',
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'same'     => 'Пароли не совпадают',
      'min'      => 'Минимум :min символов!',
      'max'      => 'Максимум :max символов!',
      'email'    => 'Некорректный e-mail',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));
    }

    if (!$user = $this->getUserByLogin($request->get('email'))) {
      return;
    }

    if (!$user->checkHashValue('password', $request->get('current_password'))) {
      return response()->json(['status' => 'error', 'current_password' => ['Неверный пароль']]);
    }

    $prepareData = $this->removeKeysFromArray(['email', 'current_password'], $request->all());
    $user->fill($prepareData);
    $user->save();

    Auth::login($user, true);

    return response()->json((['status' => 'success', 'message' => 'Пароль обновлен!']), 200);
  }

  private function removeKeysFromArray($keys, $array) {
    foreach($keys as $key) {
      unset($array[$key]);
    }
    return $array;
  }
}
