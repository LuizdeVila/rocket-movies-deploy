const knex = require("../database/knex")

class TagsController {
  async index(request, response) {
    const user_id = request.user.id

    const allTags = await knex("tags")
    .where({ user_id })

    response.json(allTags)
  }

  async create(request, response) {
    const { name, note_id } = request.body;
    const user_id = request.user.id;

    const tagData = {
      name,
      note_id,
      user_id
    };

    await knex("tags").insert(tagData);

    response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("tags").where({ id }).delete()

    return response.json()
  }
}

module.exports = TagsController