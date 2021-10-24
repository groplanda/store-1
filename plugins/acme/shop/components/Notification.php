<?php namespace Acme\Shop\Components;

use Cms\Classes\ComponentBase;

use Backend\Models\User;
use Acme\Shop\Models\Order;

use Mail;
use Illuminate\Support\Facades\Log;

use YooKassa\Model\Notification\NotificationSucceeded;
use YooKassa\Model\Notification\NotificationWaitingForCapture;
use YooKassa\Model\Notification\NotificationCanceled;
use YooKassa\Model\NotificationEventType;

class Notification extends ComponentBase
{

  public function componentDetails()
  {
      return [
          'name' => 'Yandex notification',
          'description' => 'Yandex notification'
      ];
  }

  public function onRun()
  {
    $this->notificate();
  }

  public function notificate()
  {
    $source = file_get_contents('php://input');
    if($source) {
      $requestBody = json_decode($source, true);
      try {
        $order = $this->getOrderById($requestBody['object']['id']);
        $vars = [
          'name' => $order->name,
          'user_name' => $order->user_name,
          'user_mail' => $order->user_mail,
          'user_phone' => $order->user_phone
        ];

        if ($requestBody['event'] === NotificationEventType::PAYMENT_WAITING_FOR_CAPTURE && $order['status'] !== 'waiting') { // если в ожидании
          $this->updateStatus($order['id'], 'waiting');
        }

        if($requestBody['event'] === NotificationEventType::PAYMENT_SUCCEEDED) { // если оплачен

          if ($order['status'] !== 'pay') {
            $this->updateStatus($order['id'], 'pay');
            Mail::send('acme.shop::mail.payment_admin', $vars, function($message) use ($vars) {
              $message->to($this->getUserMail(), 'Admin Person');
              $message->subject($vars['name'] . ' успешно оплачен!');
            });

            if(isset($vars['user_mail']) && !empty($vars['user_mail'])) {
              Mail::send('acme.shop::mail.payment_user', $vars, function($message) use ($vars) {
                $message->to($vars['user_mail'], 'User Person');
                $message->subject('Ваш '. $vars['name'] . ' успешно оплачен!');
              });
            };
          }
        }

        if($requestBody['event'] === NotificationEventType::PAYMENT_CANCELED) { // если отменен
          if ($order['status'] !== 'canceled') {
            $this->updateStatus($order['id'], 'canceled');
            Mail::send('acme.shop::mail.payment_canceled_admin', $vars, function($message) use ($vars) {
              $message->to($this->getUserMail(), 'Admin Person');
              $message->subject('Оплата '. $vars['name'] . ' отменена');
            });
          }
        }

        Log::info($requestBody['object']);
      } catch (Exception $e) {
        Log::error($e);
      }
    } else {
      header('HTTP/1.1 400 Something went wrong');
      exit();
    }
  }

  private function getUserMail()
  {
    return User::where('is_superuser', 1)->value('email');
  }

  private function getOrderById($id)
  {
    return Order::where('order_id', $id)->first();
  }

  private function updateStatus($id, $status) {
    $order = Order::find($id);
    $order->status = $status;
    $order->save();
  }

}
