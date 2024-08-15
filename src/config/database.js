module.exports = {
  dialect: 'postgres', //example: postgres
  host: 'localhost', //example: localhost
  username: 'name',
  password: 'password',
  database: 'task_manager', //example: tasklist
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  }
};