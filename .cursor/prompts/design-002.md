Taking into account the file react-cms-create-tables.sql, in the react-cms project,let's implement two new content types named Services and Products using our existing posts architecture:

1. In the file contentTypes.ts, add new entries to the array for `Services` and `Products`.
2. Seed the mock data with the following items:
   - Services: Software Engineering Consultancy, Digital Transformation, Software Migration, Web Development, Mobile Development.
   - Products: YouTube Stats App, My Resume Manager.
3. For the Products, add the following entries in postMetadata.ts: `website-url` and `live-demo-url`.
4. Implement the necessary changes in the navigation to include these new content types.
5. Reorder the header navigation in this way: Home, Services, Products, Blog, Courses, About, and Contact.
6. In the body of the main page, reorder the sections in this order: Welcome, Services, Products, Blog, and Featured Courses.