const http = require('http');
const fs = require('fs')
const EventEmitter = require('events')

const port = 3000
const logFile = 'logs.txt'
const dataFile = 'todos.json'


const event = new EventEmitter()


// Logging function using events
event.on("log", (message) => {
    fs.appendFile(logFile, `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) console.error("Error writing to log file:", err);
    });
});

// Read todos from file
function readTodos(callback) {
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err) return callback([]);
        callback(JSON.parse(data));
    });
}

// Write todos to file
function writeTodos(todos, callback) {
    fs.writeFile(dataFile, JSON.stringify(todos, null, 2), (err) => {
        if (err) callback(false);
        else callback(true);
    });
}

const server = http.createServer((req, res) => {
    const { method, url } = req;
    event.emit("log", `${method} ${url}`);

    if (url === "/todos" && method === "GET") {
        readTodos((todos) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(todos));
        });
    } 
    else if (url.startsWith("/todos/") && method === "GET") {
        const id = parseInt(url.split("/")[2]);
        readTodos((todos) => {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(todo));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Todo not found" }));
            }
        });
    } 
    else if (url === "/todos" && method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const newTodo = JSON.parse(body);
            if (!newTodo.title) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Title is required" }));
                return;
            }

            readTodos((todos) => {
                newTodo.id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
                newTodo.completed = newTodo.completed ?? false;

                todos.push(newTodo);
                writeTodos(todos, (success) => {
                    if (success) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(newTodo));
                    } else {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Failed to save data" }));
                    }
                });
            });
        });
    } 
    else if (url.startsWith("/todos/") && method === "PUT") {
        const id = parseInt(url.split("/")[2]);
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const updatedTodo = JSON.parse(body);
            readTodos((todos) => {
                const index = todos.findIndex(t => t.id === id);
                if (index !== -1) {
                    todos[index] = { ...todos[index], ...updatedTodo };
                    writeTodos(todos, (success) => {
                        if (success) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(todos[index]));
                        } else {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "Failed to save data" }));
                        }
                    });
                } else {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Todo not found" }));
                }
            });
        });
    } 
    else if (url.startsWith("/todos/") && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        readTodos((todos) => {
            const filteredTodos = todos.filter(t => t.id !== id);
            if (filteredTodos.length === todos.length) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Todo not found" }));
                return;
            }
            writeTodos(filteredTodos, (success) => {
                if (success) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Todo deleted successfully" }));
                } else {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Failed to delete todo" }));
                }
            });
        });
    } 
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid route" }));
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

