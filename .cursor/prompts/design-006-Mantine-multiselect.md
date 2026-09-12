In the following lines I will specify the implementation of a new "searchable multi-select" control.

In the file `PostForm.tsx` of the project `reac-cms` I have a control labeled "Categories", and another labeled "Tags".

Currently, these controls are using a custom html implementation for a multi-select option menu. However, this is not practical. 

After researching about it, I decided to implement a reusable "searchable multi-select" control for these cases.

This reusable control must have the following features:
- Allow to search for a category (or tag).
- While searching, it will display all the texts matching the coincidences in any position of the text.
- Once the user finds the searched item, it will select it, and the select option will be displayed in the area for the selected categories (or tags).
- The user can repeat the search and select other cateogries (or tags).
- If the user doesn't find the desired category (or tag), it can add the new one written in the search text area.
- When the user adds a new category (or tag), it will also be added to the selected categories (or tags) area.
- This constrol must be reusable no matter if it's for categories, tags, or another future feature.

So, please, create a "searchable multi-select" control, based on the Mantine UI library, that fits with the style and features of the project.

I don't know if one of the controls included in Mantine's library will be enough. Then, please, you take the best decision about how to make the implementation.

You can name the control with the best short and understood name according with the best practices.