In the file `Settings.tsx`, I need you to make changes in the "Home Hero" section:
- Every control inside the section must be hideable (Title, Subtitle, and CTA buttons).
- The Subtitle control must be an HtmlEditor control (not a Textarea).
- Delete the "Primary CTA (Services)" and "Secondary CTA (Products)".

Then, in the "Home Hero" section, add a feature for dynamic CTA buttons with these behavior:
- Show/Hide dynamically
- Add/Remove a CTA button
- Editable link for every CTA button created
- If the link is a partial path (for example /services) it must redirect to an internal page on the site.
- If the link is an absolute path (for example https://www.youtube.com) it must redirect to that external path.
- For every button, the color of the text, and the color of the button (background) must be changeable (maybe with color pickers but I leave it to you to decide).

You can leverage the Mantine controls if it's necessary.

Use the best approach to make these changes based on the current architecture of the project.