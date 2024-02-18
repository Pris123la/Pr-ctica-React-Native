
import mysql from 'mysql2';
import dotenv from 'dotenv'; //variables de entorno
dotenv.config();//inicializarlo

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD, 
    database: process.env.MYSQL_DATABASE, 
})
.promise();


export async function getTodoById(id) {
    const [row] = await pool.query('SELECT * FROM todos WHERE ID = ?', [id]);
    return row[0];
    //console.log(row);
}
//getTodoById(1);



export async function getTodosByID(id) {//regresa todos los todos de un usuario en especifico y los compartidos
    const [rows] = await pool.query(
        `SELECT todos.*,shared_todos.SHARED_WITH_ID FROM todos LEFT JOIN shared_todos ON todos.ID = shared_todos.TODO_ID WHERE todos.USER_ID = ? OR shared_todos.SHARED_WITH_ID = ?`, [id,id]
    );
    return rows;
}

export async function getTodo() {//TODOS LOS TODOS
    const [rows] = await pool.query(
        `SELECT * FROM todos WHERE ID = ?`, [id]
    );
    return rows[0];
}

export async function getSharedTodoByID(id) {//TODOS LOS TODO COMPARTIDOS
    const [rows] = await pool.query(
        `SELECT * FROM shared_todos WHERE TODO_ID = ?`, [id]
    );
    return rows[0];
}

export async function getUserByID(id) { //regresa un usuario en especifico
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE ID = ?`, [id]
    );
    return rows[0];
}

export async function getUserByEmail(email) {//regresa un usuario en especifico segun su correo
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE EMAIL = ?`, [email]
    );
    return rows[0];
}

export async function createTodo(user_id,title){
    const [result] = await pool.query(
        `INSERT INTO todos (USER_ID,TITLE) VALUES (?,?)`, [user_id,title]
    );
    const todoID = result.insertId;
    return getTodo(todoID);//duda
}

export async function deleteTodo(id){
    const [result] = await pool.query(
        `DELETE FROM todos WHERE ID = ?`, [id]
    );
    return result;
}

export async function toggleCompleted(id,value){
    const newValue=value=== true ? "TRUE" : "FALSE";
    const [result] = await pool.query(
        `UPDATE todos SET COMPLETED = ${newValue} WHERE ID = ?`, [id]
    );
    return result;
}

export async function shareTodo(todo_id,user_id,shared_with_id){
    const [result] = await pool.query(
        `INSERT INTO shared_todos (TODO_ID,USER_ID,SHARED_WITH_ID) VALUES (?,?,?)`, [todo_id,user_id,shared_with_id]
    );
    return result.insertId;
}