In the following lines I will specify the creation and implementation of a new control for an HTML editor that must replace the Textarea control for HTML content edition.

In this project I have a control labeled "Content (HTML)" in the file `PostForm.tsx`.

Currently I'm using a Textarea instead an HTML editor for Course, Page, Post, Product, and Service content edition. But because of the goal of this control is to create and edit HTML content for my CMS, this must be a WYSIWYG HTML editor, not just a simple text box.

After researching about the best option for a WYSIWYG editor for this project, I decided to use Tiptap.

So, please, create a new reusable control based on Tiptap that fits with the style and features of this project, and replace the Textarea control with this new reusable control for "Content (HTML)" editors (Course, Page, Post, Product, and Service editors).