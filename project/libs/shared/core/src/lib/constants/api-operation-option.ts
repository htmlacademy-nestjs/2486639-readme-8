export const ApiOperationOption = {
  User: {
    Register: { summary: 'Регистрация нового пользователя' },
    Login: { summary: 'Авторизация пользователя' },
    Logout: { summary: 'Выход пользователя' },
    RefreshTokens: { summary: 'Обновление токенов' },
    Check: { summary: 'Провека токена авторизации' },
    ChangePassword: { summary: 'Провека токена авторизации' },
    Show: { summary: 'Получение информации о пользователе' },
    ShowDetail: { summary: 'Получение детальной информации о пользователе' }
  },
  Post: {
    Index: { summary: 'Получение списка публикаций' },
    Search: { summary: 'Поиск публикаций по названию' },
    MyPosts: { summary: 'Получения списка моих публикаций' },
    MyFeed: { summary: 'Лента пользователя' },
    Detail: { summary: 'Просмотр детальной информации о публикации' },
    Create: { summary: 'Добавление новой публикации' },
    Update: { summary: 'Редактирование публицации' },
    Repost: { summary: 'Репост публикации' },
    Delete: { summary: 'Удаление публикации' },
    Count: { summary: 'Количество публикации пользователя' }
  },
  Comment: {
    Index: { summary: 'Получение списка комментариев' },
    Add: { summary: 'Добавление комментария' },
    Delete: { summary: 'Удаление комментария' }
  },
  Like: {
    Add: { summary: 'Лайкнуть публикацию' },
    Delete: { summary: 'Забрать лайк у публикации' }
  },
  Subscription: {
    Add: { summary: 'Подписаться на пользователя' },
    Delete: { summary: 'Отписаться от пользователя' },
    Count: { summary: 'Количество подписчико у пользователя' }
  }
} as const;
