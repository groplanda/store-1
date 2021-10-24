<?php

namespace Acme\Shop\Classes;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Validator;
use Backend\Models\User;
use Acme\Shop\Models\Comment;

class CommentController extends Controller
{
  /**
   *
   *
   * @return Response
   */
  public function add(Request $request)
  {

    $rules = [
      'title'  => 'required|min:4|max:50',
      'star' => 'required|between:1,5',
      'description'  => 'required|max:500',
      'product_id' => 'required'
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'star.required' => 'Укажите оценку',
      'between'  => 'Оценка должна быть от 1 до 5',
      'min'      => 'Минимум :min символов!',
      'max'      => 'Максимум :max символов!',
      'email'    => 'Некорректный e-mail',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {

      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));

    } else {
      $this->insertData($request);
      return response()->json(['status' => 'success', 'message' => 'Отзыв успешно добавлен на модерацию']);
    }
  }

  public function getUserMail()
  {
    return User::where('is_superuser', 1)->value('email');
  }

  private function insertData($request) {

    $comment = new Comment;
    $comment->status = 0;
    $comment->title = $request->get('title');
    $comment->star = $request->get('star');
    $comment->description = $request->get('description');
    $comment->product_id = $request->get('product_id');

    $query = $comment->save();
    return $query;
  }

}
