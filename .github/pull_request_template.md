1. Task: [link](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md)
2. Screenshot:
3. Deploy:
4. Done dd.mm.yyyy / deadline 17.07.2026
5. Score: 0 / 550

- [ ] Feature 1: App Header(**60 points**)

    <details>
    <summary>EN</summary>

  ### Feature 1: App Header(**60 points**)

  **As a** user
  **I want** to access a header with navigation controls and authentication options on the main page
  **So that** I can navigate the application and manage my authentication state

  > **Note:** The main page itself is the Swagger UI (Editor + Viewer). The functionality described in this feature refers specifically to the **header** component displayed on the main page, not the page content itself.

  **Scenario:** Header for non-authenticated users

  - **Given** I am not authenticated
  - **When** I visit the main page
  - **Then** the header displays Sign In and Sign Up buttons in the upper right corner
  - **And** navigation links to the About page are available in the header and footer

  **Scenario:** Header for authenticated users

  - **Given** I am authenticated
  - **When** I visit the main page
  - **Then** the header displays History and Sign Out buttons in the upper right corner

  **Scenario:** Token expiry handling

  - **Given** I am authenticated with an expired or invalid token
  - **When** I try to access a private route (either automatically, on page refresh, or on route change)
  - **Then** I am redirected to the Main page

  **Scenario:** Navigation to authentication forms

  - **Given** I am on the main page
  - **When** I press the Sign In or Sign Up button in the header
  - **Then** I am redirected to the route with the respective form

  **Acceptance Criteria:**

  - [ ] Non-authenticated users see Sign In and Sign Up buttons in the header's upper right corner. [15 points]
  - [ ] Authenticated users see History and Sign Out buttons in the header's upper right corner. [10 points]
  - [ ] Navigation link to About page is available in header and footer. [10 points]
  - [ ] If the token is expired/invalid, the user is redirected from private routes to the Main page. [10 points]
  - [ ] Pressing the Sign In / Sign Up button redirects to the route with the respective form. [15 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 1: Шапка приложения (**60 баллов**)

  **Как** пользователь
  **Я хочу** видеть на главной странице шапку с элементами навигации и настройками аутентификации
  **Чтобы** я мог перемещаться по приложению и управлять своим состоянием аутентификации

  > **Примечание:** Главная страница сама по себе является Swagger UI (Редактор + Просмотрщик). Функциональность, описанная в этой функции, относится именно к компоненту **шапки**, отображаемому на главной странице, а не к содержимому самой страницы.

  **Сценарий:** Шапка для неаутентифицированных пользователей

  - **Дано** я не аутентифицирован
  - **Когда** я загружаю главную страницу
  - **Тогда** шапка отображает кнопки Sign In (Вход) и Sign Up (Регистрация) в правом верхнем углу
  - **И** ссылки навигации на страницу About (О проекте) доступны в шапке и подвале (footer)

  **Сценарий:** Шапка для аутентифицированных пользователей

  - **Дано** я аутентифицирован
  - **Когда** я загружаю главную страницу
  - **Тогда** шапка отображает кнопки History (История) и Sign Out (Выход) в правом верхнем углу

  **Сценарий:** Обработка истечения срока действия токена

  - **Дано** я аутентифицирован с просроченным или недействительным токеном
  - **Когда** я пытаюсь получить доступ к закрытому маршруту (автоматически, при обновлении страницы или смене маршрута)
  - **Тогда** я перенаправляюсь на Главную страницу

  **Сценарий:** Навигация к формам аутентификации

  - **Дано** я нахожусь на главной странице
  - **Когда** я нажимаю кнопку Sign In или Sign Up в шапке
  - **Тогда** я перенаправляюсь на маршрут с соответствующей формой

  **Критерии приёмки:**

  - [ ] Неаутентифицированные пользователи видят кнопки Sign In и Sign Up в правом верхнем углу шапки. [15 баллов]
  - [ ] Аутентифицированные пользователи видят кнопки History и Sign Out в правом верхнем углу шапки. [10 баллов]
  - [ ] Ссылка навигации на страницу About доступна в шапке и подвале. [10 баллов]
  - [ ] Если токен просрочен/недействителен, пользователь перенаправляется с закрытых маршрутов на Главную страницу. [10 баллов]
  - [ ] Нажатие кнопки Sign In / Sign Up перенаправляет на маршрут с соответствующей формой. [15 баллов]
  </details>

- [ ] Feature 2: Sign In / Sign Up (**50 points**)

    <details>
    <summary>EN</summary>

  ### Feature 2: Sign In / Sign Up (**50 points**)

  **As a** user
  **I want** to register and authenticate using email and password
  **So that** I can access personalized features and request history

  **Scenario:** Accessing authentication controls

  - **Given** I am not authenticated
  - **When** I navigate through the application
  - **Then** Sign In, Sign Up, and Sign Out buttons are present everywhere they should be

  **Scenario:** Client-side validation

  - **Given** I am filling in the Sign In / Sign Up form
  - **When** I enter an invalid email or a weak password
  - **Then** validation errors are shown before the form is submitted

  **Scenario:** Successful login

  - **Given** I have submitted valid credentials
  - **When** the login succeeds
  - **Then** I am redirected to the Main page

  **Scenario:** Redirect when already logged in

  - **Given** I am already authenticated
  - **When** I navigate to the Sign In or Sign Up route
  - **Then** I am redirected to the Main page

  **Acceptance Criteria:**

  - [ ] Buttons for Sign In / Sign Up / Sign Out are present everywhere they should be. [10 points]
  - [ ] Client-side validation is implemented (email format, password strength: min 8 chars, at least one letter, one digit, one special character, Unicode supported). [20 points]
  - [ ] Upon successful login, the user is redirected to the Main page. [10 points]
  - [ ] If the user is already logged in and tries to reach Sign In / Sign Up routes, they are redirected to the Main page. [10 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 2: Вход / Регистрация (**50 баллов**)

  **Как** пользователь
  **Я хочу** зарегистрироваться и пройти аутентификацию, используя электронную почту и пароль
  **Чтобы** я мог получать доступ к персонализированным функциям и истории запросов

  **Сценарий:** Доступ к элементам управления аутентификацией

  - **Дано** я не аутентифицирован
  - **Когда** я перемещаюсь по приложению
  - **Тогда** кнопки Sign In, Sign Up и Sign Out присутствуют везде, где должны

  **Сценарий:** Клиентская валидация

  - **Дано** я заполняю форму входа / регистрации
  - **Когда** я ввожу неверный email или слабый пароль
  - **Тогда** ошибки валидации показываются до отправки формы

  **Сценарий:** Успешный вход

  - **Дано** я отправил действительные учётные данные
  - **Когда** вход выполнен успешно
  - **Тогда** я перенаправляюсь на Главную страницу

  **Сценарий:** Перенаправление, если уже выполнен вход

  - **Дано** я уже аутентифицирован
  - **Когда** я перехожу на маршрут входа или регистрации
  - **Тогда** я перенаправляюсь на Главную страницу

  **Критерии приёмки:**

  - [ ] Кнопки Sign In / Sign Up / Sign Out присутствуют везде, где должны. [10 баллов]
  - [ ] Реализована клиентская валидация (формат email, сложность пароля: минимум 8 символов, хотя бы одна буква, одна цифра, один специальный символ, поддержка Unicode). [20 баллов]
  - [ ] После успешного входа пользователь перенаправляется на Главную страницу. [10 баллов]
  - [ ] Если пользователь уже вошёл в систему и пытается перейти на маршруты входа/регистрации, он перенаправляется на Главную страницу. [10 баллов]
  </details>

- [ ] Feature 3: Swagger Editor (**120 points**)

    <details>
    <summary>EN</summary>

  ### Feature 3: Swagger Editor (**120 points**)

  **As a** user
  **I want** to paste and edit OpenAPI/Swagger specifications in a code editor
  **So that** I can define APIs and automatically populate the viewer with endpoints

  **Scenario:** Loading and editing a schema

  - **Given** I am on the main page (authenticated or not)
  - **When** I paste or type an OpenAPI/Swagger specification
  - **Then** the format is auto-detected (JSON or YAML)
  - **And** the schema is validated with errors displayed if invalid
  - **And** the Swagger Viewer automatically populates with endpoints when the schema is valid

  **Scenario:** Format switching

  - **Given** I have a valid schema loaded in the editor
  - **When** I toggle the format switch button
  - **Then** the schema is automatically converted between JSON and YAML
  - **And** the editor displays the converted schema without data loss

  **Scenario:** Responsive split view

  - **Given** I am using the application
  - **When** the horizontal length is greater than the vertical length
  - **Then** the editor and viewer are displayed in a horizontal split view
  - **And** when the vertical length is greater, a vertical split view is used instead

  **Scenario:** Saving schema (authenticated users)

  - **Given** I am authenticated and have a valid schema loaded
  - **When** I choose to save the schema
  - **Then** the schema is saved to the server/database
  - **And** the next time I log in, the saved schema is automatically restored in the editor

  **Acceptance Criteria:**

  - [ ] Loading/pasting OpenAPI/Swagger schema in JSON and YAML formats is supported. [25 points]
  - [ ] Auto-detection of input format (JSON vs YAML) is implemented. [20 points]
  - [ ] Format switching with automatic conversion (JSON ↔ YAML) works correctly. [20 points]
  - [ ] Schema validation with error indication is implemented. [15 points]
  - [ ] Authenticated users can save schemas; the saved schema is automatically restored in the editor upon next login. [10 points]
  - [ ] The Viewer automatically populates with endpoints when the schema is valid. [10 points]
  - [ ] Responsive split view adjusts based on screen orientation (horizontal/vertical). [20 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 3: Swagger Редактор (**120 баллов**)

  **Как** пользователь
  **Я хочу** вставлять и редактировать спецификации OpenAPI/Swagger в редакторе кода
  **Чтобы** я мог описывать API и автоматически заполнять просмотрщик конечными точками

  **Сценарий:** Загрузка и редактирование схемы

  - **Дано** я нахожусь на главной странице (аутентифицирован или нет)
  - **Когда** я вставляю или печатаю спецификацию OpenAPI/Swagger
  - **Тогда** формат автоматически определяется (JSON или YAML)
  - **И** схема валидируется с отображением ошибок, если она недействительна
  - **И** Swagger Просмотрщик автоматически заполняется конечными точками, когда схема действительна

  **Сценарий:** Переключение формата

  - **Дано** в редакторе загружена действительная схема
  - **Когда** я нажимаю кнопку переключения формата
  - **Тогда** схема автоматически конвертируется между JSON и YAML
  - **И** редактор отображает конвертированную схему без потери данных

  **Сценарий:** Адаптивный разделённый вид

  - **Дано** я использую приложение
  - **Когда** горизонтальная длина больше вертикальной
  - **Тогда** редактор и просмотрщик отображаются в горизонтальном разделённом виде
  - **И** когда вертикальная длина больше, используется вертикальный разделённый вид

  **Сценарий:** Сохранение схемы (для аутентифицированных пользователей)

  - **Дано** я аутентифицирован и у меня загружена действительная схема
  - **Когда** я выбираю сохранение схемы
  - **Тогда** схема сохраняется на сервере/в базе данных
  - **И** в следующий раз, когда я войду в систему, сохранённая схема автоматически восстанавливается в редакторе

  **Критерии приёмки:**

  - [ ] Поддерживается загрузка/вставка схемы OpenAPI/Swagger в форматах JSON и YAML. [25 баллов]
  - [ ] Реализовано автоматическое определение входного формата (JSON vs YAML). [20 баллов]
  - [ ] Переключение формата с автоматической конвертацией (JSON ↔ YAML) работает корректно. [20 баллов]
  - [ ] Реализована валидация схемы с указанием ошибок. [15 баллов]
  - [ ] Аутентифицированные пользователи могут сохранять схемы; сохранённая схема автоматически восстанавливается в редакторе при следующем входе. [10 баллов]
  - [ ] Просмотрщик автоматически заполняется конечными точками, когда схема действительна. [10 баллов]
  - [ ] Адаптивный разделённый вид изменяется в зависимости от ориентации экрана (горизонтальная/вертикальная). [20 баллов]
  </details>

- [ ] Feature 4: Swagger Viewer (**120 points**)

    <details>
    <summary>EN</summary>

  ### Feature 4: Swagger Viewer (**120 points**)

  **As a** user
  **I want** to view and interact with API endpoints defined in the loaded schema
  **So that** I can understand the API structure and test endpoints directly from the browser

  **Scenario:** Viewing endpoint details

  - **Given** a valid OpenAPI/Swagger schema is loaded
  - **When** I view the Swagger Viewer
  - **Then** all endpoints are listed and organized by path and method
  - **And** each endpoint shows method, path, parameters (path, query, header, cookie), request schema, and response details for all status codes

  **Scenario:** Executing a request (Try-It-Out)

  - **Given** I have selected an endpoint in the Swagger Viewer
  - **When** I fill in parameter values, headers, and request body and click Execute
  - **Then** the request is sent through the server to avoid CORS issues
  - **And** the response status, headers, and body are displayed

  **Scenario:** Generating a cURL command

  - **Given** I have filled in request details for an endpoint
  - **When** I click the Generate cURL button
  - **Then** a cURL command is generated from the current request state
  - **And** I can copy it to my clipboard

  **Scenario:** Request tracking (authenticated users)

  - **Given** I am authenticated and execute a request
  - **When** the response is received
  - **Then** the request details are recorded on the server side and are available in History & Analytics

  **Acceptance Criteria:**

  - [ ] Endpoint list is displayed with organization by path/method. [20 points]
  - [ ] Endpoint details show method, path, and all parameter types (path, query, header, cookie). [25 points]
  - [ ] Request schema and example payloads are displayed. [20 points]
  - [ ] Response schema, examples, and all supported status codes are displayed. [25 points]
  - [ ] Try-It-Out functionality allows filling parameters, headers, and body; executing requests; and displaying responses. [20 points]
  - [ ] Generate cURL button with copy-to-clipboard functionality is implemented. [10 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 4: Swagger Просмотрщик (**120 баллов**)

  **Как** пользователь
  **Я хочу** просматривать конечные точки API, определённые в загруженной схеме, и взаимодействовать с ними
  **Чтобы** я мог понимать структуру API и тестировать конечные точки прямо из браузера

  **Сценарий:** Просмотр деталей конечной точки

  - **Дано** загружена действительная схема OpenAPI/Swagger
  - **Когда** я смотрю на Swagger Просмотрщик
  - **Тогда** все конечные точки перечислены и сгруппированы по пути и методу
  - **И** каждая конечная точка показывает метод, путь, параметры (путь, query, заголовок, cookie), схему запроса и детали ответа для всех кодов состояния

  **Сценарий:** Выполнение запроса (Try-It-Out)

  - **Дано** я выбрал конечную точку в Swagger Просмотрщике
  - **Когда** я заполняю значения параметров, заголовки и тело запроса и нажимаю Execute (Выполнить)
  - **Тогда** запрос отправляется через сервер для избежания проблем с CORS
  - **И** отображаются статус ответа, заголовки и тело

  **Сценарий:** Генерация команды cURL

  - **Дано** я заполнил детали запроса для конечной точки
  - **Когда** я нажимаю кнопку Generate cURL (Сгенерировать cURL)
  - **Тогда** из текущего состояния запроса генерируется команда cURL
  - **И** я могу скопировать её в буфер обмена

  **Сценарий:** Отслеживание запросов (для аутентифицированных пользователей)

  - **Дано** я аутентифицирован и выполняю запрос
  - **Когда** получен ответ
  - **Тогда** детали запроса записываются на стороне сервера и доступны в разделе История и Аналитика

  **Критерии приёмки:**

  - [ ] Список конечных точек отображается с группировкой по пути/методу. [20 баллов]
  - [ ] Детали конечной точки показывают метод, путь и все типы параметров (путь, query, заголовок, cookie). [25 баллов]
  - [ ] Отображаются схема запроса и примеры полезной нагрузки (payload). [20 баллов]
  - [ ] Отображаются схема ответа, примеры и все поддерживаемые коды состояния. [25 баллов]
  - [ ] Функциональность Try-It-Out позволяет заполнять параметры, заголовки и тело; выполнять запросы; отображать ответы. [20 баллов]
  - [ ] Реализована кнопка Generate cURL с возможностью копирования в буфер обмена. [10 баллов]
  </details>

- [ ] Feature 5: History and Analytics (**70 points**)

    <details>
    <summary>EN</summary>

  ### Feature 5: History and Analytics (**70 points**)

  **As an** authenticated user
  **I want** to view a history of my executed API requests with analytics
  **So that** I can review past API interactions and performance metrics

  **Scenario:** Viewing request history

  - **Given** I am authenticated and have executed at least one request
  - **When** I navigate to the History & Analytics route
  - **Then** my requests are displayed sorted by timestamp (most recent first)
  - **And** each entry links to detailed analytics for that request

  **Scenario:** Empty history

  - **Given** I am authenticated but have not executed any requests
  - **When** I navigate to the History & Analytics route
  - **Then** an informational message is shown (e.g., "You haven't executed any requests yet")
  - **And** links to the Editor and Viewer are provided

  **Scenario:** Access control and lazy loading

  - **Given** I am not authenticated
  - **When** I try to access the History & Analytics route
  - **Then** I am redirected to the Main page
  - **And** the History & Analytics code is not downloaded (lazy-loaded)

  **Scenario:** Server-side rendering

  - **Given** I am authenticated
  - **When** the History & Analytics page loads
  - **Then** the request history and analytics are server-side generated and rendered before being sent to the client

  **Acceptance Criteria:**

  - [ ] History and analytics is server-side generated and shows an informational message with links to the editor/viewer when there are no requests in the database. [15 points]
  - [ ] Requests are displayed sorted by timestamp (most recent first). [10 points]
  - [ ] The following analytics are recorded from the server side and displayed: request duration, response status code, request timestamp, request method, request size, response size, error details, endpoint/URL. [45 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 5: История и Аналитика (**70 баллов**)

  **Как** аутентифицированный пользователь
  **Я хочу** просматривать историю моих выполненных API-запросов с аналитикой
  **Чтобы** я мог анализировать прошлые взаимодействия с API и метрики производительности

  **Сценарий:** Просмотр истории запросов

  - **Дано** я аутентифицирован и выполнил хотя бы один запрос
  - **Когда** я перехожу на маршрут История и Аналитика
  - **Тогда** мои запросы отображаются, отсортированные по времени (сначала самые новые)
  - **И** каждая запись содержит ссылку на детальную аналитику этого запроса

  **Сценарий:** Пустая история

  - **Дано** я аутентифицирован, но не выполнил ни одного запроса
  - **Когда** я перехожу на маршрут История и Аналитика
  - **Тогда** показывается информационное сообщение (например, «Вы ещё не выполнили ни одного запроса»)
  - **И** предоставлены ссылки на Редактор и Просмотрщик

  **Сценарий:** Контроль доступа и ленивая загрузка

  - **Дано** я не аутентифицирован
  - **Когда** я пытаюсь перейти на маршрут История и Аналитика
  - **Тогда** я перенаправляюсь на Главную страницу
  - **И** код страницы История и Аналитика не загружается (ленивая загрузка)

  **Сценарий:** Серверный рендеринг

  - **Дано** я аутентифицирован
  - **Когда** страница История и Аналитика загружается
  - **Тогда** история запросов и аналитика генерируются на сервере и отрисовываются до отправки клиенту

  **Критерии приёмки:**

  - [ ] История и аналитика генерируются на сервере и показывают информационное сообщение со ссылками на редактор/просмотрщик, когда в базе данных нет запросов. [15 баллов]
  - [ ] Запросы отображаются, отсортированные по времени (сначала самые новые). [10 баллов]
  - [ ] Следующие метрики записываются на стороне сервера и отображаются: длительность запроса, код состояния ответа, временная метка запроса, метод запроса, размер запроса, размер ответа, детали ошибки, конечная точка/URL. [45 баллов]
  </details>

- [ ] Feature 6: About Page (**25 points**)

    <details>
    <summary>EN</summary>

  ### Feature 6: About Page (**25 points**)

  **As a** user
  **I want** to view information about the RS School course and the development team
  **So that** I can learn more about the project and its creators

  **Scenario:** Accessing the About page

  - **Given** I am using the application (authenticated or not)
  - **When** I navigate to the About page
  - **Then** I see information about the RS School course, team members with their roles and GitHub links, project description, technologies used, and links to relevant resources

  **Scenario:** Public access

  - **Given** I am not authenticated
  - **When** I navigate to the About page
  - **Then** the page is fully accessible without requiring login

  **Acceptance Criteria:**

  - [ ] About page is accessible to all users (public route). [5 points]
  - [ ] About page contains information about the RS School course. [5 points]
  - [ ] About page contains team member information (names, roles, GitHub links). [10 points]
  - [ ] About page design is consistent with the application design. [5 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 6: Страница About (О проекте) (**25 баллов**)

  **Как** пользователь
  **Я хочу** видеть информацию о курсе RS School и команде разработчиков
  **Чтобы** я мог узнать больше о проекте и его создателях

  **Сценарий:** Доступ к странице About

  - **Дано** я использую приложение (аутентифицирован или нет)
  - **Когда** я перехожу на страницу About
  - **Тогда** я вижу информацию о курсе RS School, участниках команды с их ролями и ссылками на GitHub, описание проекта, использованные технологии и ссылки на соответствующие ресурсы

  **Сценарий:** Публичный доступ

  - **Дано** я не аутентифицирован
  - **Когда** я перехожу на страницу About
  - **Тогда** страница полностью доступна без необходимости входа в систему

  **Критерии приёмки:**

  - [ ] Страница About доступна всем пользователям (публичный маршрут). [5 баллов]
  - [ ] Страница About содержит информацию о курсе RS School. [5 баллов]
  - [ ] Страница About содержит информацию об участниках команды (имена, роли, ссылки на GitHub). [10 баллов]
  - [ ] Дизайн страницы About соответствует дизайну приложения. [5 баллов]
  </details>

- [ ] Feature 7: General Requirements (**55 points**)

    <details>
    <summary>EN</summary>

  ### Feature 7: General Requirements (**55 points**)

  **As a** user
  **I want** the application to support multiple languages, provide smooth interactions, and handle errors gracefully
  **So that** I can use the app comfortably regardless of language preference or error conditions

  **Scenario:** Language switching

  - **Given** I am using the application
  - **When** I click the language toggler/select in the header
  - **Then** the application switches to the selected language
  - **And** at least 2 languages are supported

  **Scenario:** Sticky header behavior

  - **Given** I am on a page with scrollable content
  - **When** I scroll down the page
  - **Then** the header remains visible (sticky)
  - **And** the header animates when it becomes sticky (color change or height reduction)

  **Scenario:** Error display

  - **Given** an unhandled exception or application-level error occurs
  - **When** the error is triggered
  - **Then** a user-friendly error message is displayed (toast, pop-up, or similar)

  **Scenario:** Private route protection

  - **Given** I am not authenticated
  - **When** I try to access a private route
  - **Then** I receive a 401 response and am redirected to the Main page

  **Acceptance Criteria:**

  - [ ] Multiple (at least 2) languages are supported with an i18n toggler in the header. [30 points]
  - [ ] Sticky header with animation when it becomes sticky is implemented. [10 points]
  - [ ] Errors are displayed in a user-friendly format. [10 points]
  - [ ] Private routes are properly protected (401 if not authenticated). See [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized). [5 points]

    </details>

    <details>
    <summary>RU</summary>

  ### Функция 7: Общие требования (**55 баллов**)

  **Как** пользователь
  **Я хочу**, чтобы приложение поддерживало несколько языков, обеспечивало плавное взаимодействие и корректно обрабатывало ошибки
  **Чтобы** я мог комфортно пользоваться приложением независимо от языковых предпочтений или ошибочных ситуаций

  **Сценарий:** Переключение языка

  - **Дано** я использую приложение
  - **Когда** я нажимаю переключатель языка / выбор языка в шапке
  - **Тогда** приложение переключается на выбранный язык
  - **И** поддерживается не менее 2 языков

  **Сценарий:** Липкая (sticky) шапка

  - **Дано** я на странице с прокручиваемым содержимым
  - **Когда** я прокручиваю страницу вниз
  - **Тогда** шапка остаётся видимой (липкой)
  - **И** шапка анимируется при залипании (изменение цвета или уменьшение высоты)

  **Сценарий:** Отображение ошибок

  - **Дано** возникает необработанное исключение или ошибка уровня приложения
  - **Когда** ошибка срабатывает
  - **Тогда** отображается понятное сообщение об ошибке (toast, попап или аналогичное)

  **Сценарий:** Защита закрытых маршрутов

  - **Дано** я не аутентифицирован
  - **Когда** я пытаюсь перейти на закрытый маршрут
  - **Тогда** я получаю ответ 401 и перенаправляюсь на Главную страницу

  **Критерии приёмки:**

  - [ ] Поддерживается несколько (не менее 2) языков с переключателем i18n в шапке. [30 баллов]
  - [ ] Реализована липкая шапка с анимацией при залипании. [10 баллов]
  - [ ] Ошибки отображаются в понятном для пользователя формате. [10 баллов]
  - [ ] Закрытые маршруты должным образом защищены (401, если не аутентифицирован). См. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized). [5 баллов]
  </details>

- [ ] Feature 8: YouTube Video (**50 points**)

    <details>
    <summary>EN</summary>

  ### Feature 8: YouTube Video (**50 points**)

  **As a** reviewer
  **I want** to watch a short video walkthrough of the application
  **So that** I can efficiently verify all implemented features

  **Scenario:** Video submission

  - **Given** the project is complete
  - **When** I submit the pull request
  - **Then** a 5–7 minute YouTube video is linked in the pull request
  - **And** the video demonstrates how each evaluation criterion is implemented

  **Acceptance Criteria:**

  - [ ] A 5–7 minute YouTube video is linked in the pull request demonstrating all implemented features. [50 points]
    </details>

      <details>
      <summary>RU</summary>

  ### Функция 8: YouTube Видео (**50 баллов**)

  **Как** проверяющий
  **Я хочу** посмотреть короткий видеообзор приложения
  **Чтобы** я мог эффективно проверить все реализованные функции

  **Сценарий:** Предоставление видео

  - **Дано** проект завершён
  - **Когда** я отправляю pull request
  - **Тогда** в pull request добавлена ссылка на 5–7 минутное YouTube видео
  - **И** в видео показано, как реализован каждый критерий оценки

  **Критерии приёмки:**

  - [ ] В pull request добавлена ссылка на 5–7 минутное YouTube видео, демонстрирующее все реализованные функции. [50 баллов]
  </details>
