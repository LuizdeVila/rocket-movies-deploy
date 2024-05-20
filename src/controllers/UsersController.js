const  { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError");
const knex = require("../database/knex")

class UsersController {
  async create(request, response) {
    const { name, email, password, avatar } = request.body

    const criptographPassword = await hash(password, 8);

    const countEmail = await knex("users").where("email", email).count("* as total").first();

    if (countEmail.total > 0) {
        throw new AppError("Este e-mail já está cadastrado");
    }

    await knex("users").insert({
      name,
      email,
      password: criptographPassword,
      avatar
    })

    response.json()
  }

  async update(request, response) {
    const { name, email, password, newPassword } = request.body
    const user_id = request.user.id

    const user = await knex("users").where("id", user_id).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("A antiga senha não está correta");
    }

    const newPasswordHash = await hash(newPassword, 8);

    await knex("users").where("id", user_id).update({ name, email, password: newPasswordHash })

    return response.json()
  }

  async delete(request, response) {
    const user_id = request.user.id

    await knex("users").where("id", user_id).delete()

    return response.json()
  }
}

module.exports = UsersController;