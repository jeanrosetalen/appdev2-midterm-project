# APPDEV2-Midterm-Project

### Name: Jean Rose Talen 
### Program: BSIS-3

### Project Summary:

This Project provides a simple RESTful API that mimics  JSONPlaceholder's todos endpoint using Node.js, for managing todos. It provides a way to Create, Read, Update, and Delete (CRUD) todo items while keeping everything stored in a JSON file (todos.json), making it easy to use without a database. This project also tracks API requests using events module, that logs a detailed information about the request.

### Installation and Running Instructions:
* Step 1: you have to ensure that you have node.js in you computer, if not you can download and install node. js in nodejs.org.
* Step 2: Setup your project directory, you can clone this repository on your local device or integrate the repo to your local folder.
* Step 3: The project must have these files: server.js, todos.json, and logs.txt.

#### In running the project
* Step 1: run this syntax to your terminal "node server.js"
* Step 2: You can do the CRUD(Creat, Read, Update, Delete) operations for managing todos, by running the following RESTful API request conventions:
    * GET/todos (to retrieves all todos from the JSON file.)
    * GET/todos/:id (to retrieves a specific todo using its ID.)
    * POST/todos (to create a new todo, but the title is required.)
    * PUT/todos/:id (to update an existing todo.)
    * DELETE/todos/:id (to delete a todo using its ID.)

### For a more detailed and visual information you can refer to this demonstration video:
https://drive.google.com/drive/folders/1PJ_ZUwgk8injM9BX9UIjwaAmT02cpJWp?usp=sharing








