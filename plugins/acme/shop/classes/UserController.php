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
use Acme\Shop\Models\Wish;
use Acme\Shop\Models\Product;
use Mail;

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

    $credentials = [
      'login'    => $request->get('login'),
      'password' => $request->get('password')
    ];
    Event::fire('rainlab.user.beforeAuthenticate', [$this, $credentials]);
    $user = Auth::authenticate($credentials, true);

    if ($ipAddress = $request->ip()) {
      $user->touchIpAddress($ipAddress);
    }

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
      return response()->json($user->id);
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

  public function resetPassword(Request $request) {
    $rules = [
      'email' => 'required|email'
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

    if (!$user = $this->getUserByLogin($request->get('email'))) {
      return response()->json(['status' => 'error', 'email' => ['Пользователь не существует!']]);
    }

    $code = implode('!', [$user->id, $user->getResetPasswordCode()]);
    $link = $this->makeResetUrl($code);
    $data = [
      'name' => $user->name,
      'username' => $user->username,
      'link' => $link,
      'code' => $code
    ];

    Mail::send('acme.shop::mail.restore', $data, function($message) use ($user) {
        $message->to($user->email, $user->full_name);
    });

    return response()->json((['status' => 'success', 'message' => 'На ваш e-mail отправлен <br>код для сброса пароля!']), 200);
  }


  public function restorePassword(Request $request) {
    $rules = [
      'code'     => 'required',
      'password' => 'required|between:6,255'
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'between' => 'Длина пароля должна быть от :min до :max символов.',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));
    }


    $errorResponse = response()->json(['status' => 'error', 'code' => ['Неверный код восстановления']]);

    $parts = explode('!', $request->get('code'));
    if (count($parts) != 2) {
      return $errorResponse;
    }

    list($userId, $code) = $parts;

    if (!strlen(trim($userId)) || !strlen(trim($code)) || !$code) {
      return $errorResponse;
    }

    if (!$user = Auth::findUserById($userId)) {
      return $errorResponse;
    }

    if (!$user->attemptResetPassword($code, $request->get('password'))) {
      return $errorResponse;
    }

    if (method_exists(\RainLab\User\Classes\AuthManager::class, 'clearThrottleForUserId')) {
      Auth::clearThrottleForUserId($user->id);
    }
    return response()->json((['status' => 'success', 'message' => 'Пароль успешно изменен']), 200);
  }

  protected function makeResetUrl($code) {
    $url = $this->getHostUrl();
    if (strpos($url, $code) === false) {
      $url .= '/reset-password/?reset=' . $code;
    }
    return $url;
  }

  private function removeKeysFromArray($keys, $array) {
    foreach($keys as $key) {
      unset($array[$key]);
    }
    return $array;
  }

  private function getHostUrl() {
    $url = 'http' . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? 's' : '') . '://';
    return $url . $_SERVER['SERVER_NAME'];
  }
}
