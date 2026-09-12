In the database I've created 2 tables to apply the i18n approach for the static text in the website that we are working on the project `react-cms-jm`.

The script `react-cms-create-tables-param_ui.sql` contains the statements to create the tables where I am expecting to store the text of the static content. So, depending on the browser language, the website will show the text of the static content (buttons, option menus, header, etc) in that language.

The script `react-cms-insert-param_ui.sql` is just a reference for you to understand how more or less I am expecting the input data in the database. But don't take this file as source of truth, because it's just an example.

As you can see, these changes shouldn't affect the logic or behavior of the navigation or mocked dynamic content (posts, categories, content_types, permission, roles, etc).

So, these changes are only for the static controls or components (buttons, option menus, header, etc).

Please, implement the soft refactor of the static controls or components to support this i18n approach, mocking the necessary data.

Remember that we are just in a POC phase of development.

Note: Maybe, the most difficult part will be the definition of the values of string_key and ui_component for the param_ui_strings table (mocked data). So, be careful assigning those values because even if they are mocked by now, it's highly possible that later I will use this data to be stored and they will be present in future queries when I implement the backend.