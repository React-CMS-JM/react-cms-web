I would like that my CMS could have more control over the Home page and the main menu.

1. First dynamic change:
- In the `HomePage.tsx` I can see that there is a non-editable content in the "hero" section.
- This should also be dynamically editable like the Welcome section that follows it.

2. Second dynamic change:
- The rest of the HomePage body shows the sections for Services, Products, Blog, and Featured Courses. These are fixed. 
- These sections must be managed from the administration panel, allowing any section to be shown or hidden, as well as reordered.

3. Third dynamic change:
- In the case of the main menu defined in `PublicLayout.tsx` I should be able to hide or show the options, and also I should be able to reorder them.

Please, make the implementation of these three features, taking care to keep the styling and avoiding conflicts.

If it's necessary, mock the required data following the best practices, and the architecture of the project.