<?php namespace Acme\Profile;

use System\Classes\PluginBase;
use \October\Rain\Database\Traits\Validation;
use RainLab\User\Controllers\Users as UserController;
use RainLab\User\Models\User as UserModel;

class Plugin extends PluginBase
{
    public function registerComponents()
    {
    }

    public function registerSettings()
    {
    }

    public function boot()
    {
      UserModel::extend(function($model) {

        $model->addFillable([
          'phone',
          'address',
          'is_subscribe'
        ]);

        $model->rules['password'] = 'between:6,255';
        $model->rules['password_confirmation'] = 'between:6,255';

        $model->bindEvent('model.beforeValidate', function() use ($model) {
          $model->rules['password'] = 'between:6,255';
          $model->rules['password_confirmation'] = 'between:6,255';
        });


      });

      UserController::extendFormFields(function($form, $model, $context) {
        $form->addTabFields([
         'phone' => [
            'label'   => 'Телефон',
            'type'    =>  'text',
            'tab'     =>   'Профиль'
          ],
          'address' => [
            'label'   => 'Адрес',
            'type'    =>  'text',
            'tab'     =>   'Профиль'
          ],
          'is_subscribe' => [
            'label'   => 'Подписан на рассылку?',
            'type'    =>  'switch',
            'default' => 'off',
            'tab'     =>   'Профиль'
          ]

        ]);

      });
    }
}
