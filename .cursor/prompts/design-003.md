I have updated my database schema to support multilingual content using the **Translation Sidecar Table Pattern** with the `_i18n` suffix (see the attached `react-cms-create-tables-v02.sql`). 

All translatable text fields (like `title`, `slug`, `content`, `excerpt`, `name`, etc.) have been completely removed from the main entity tables (`posts`, `course_lessons`, `categories`, `tags`) and moved into sidecar tables (`post_i18n`, `course_lesson_i18n`, `category_i18n`, `tag_i18n`) mapped by a `language_code`.

Let's start by identifying the exact files that need to be changed.

Then, please help me refactor our existing project `react-cms-jm` to implement this internationalization architecture at mock level because we are still in a Proof of Concept phase.

Previously, you used Docker for your tests but now I've installed Node in case you need to run tests again.