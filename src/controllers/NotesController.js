const knex = require("../database/knex")

class NotesController {
  async index(request, response) {
    const user_id = request.user.id;

    const allNotes = await knex("notes")
        .select("notes.*", "tags.id as tag_id", "tags.name as tag_name")
        .where({ "notes.user_id": user_id })
        .leftJoin("tags", "notes.id", "tags.note_id");

    response.json(allNotes);
  }

  async create(request, response) {
    const { title, description, rating } = request.body;
    const user_id = request.user.id;

    const ratingNumber = parseFloat(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
        return response.status(400).json({ error: "Rating deve ser um número entre 0 e 5" });
    }

    const [note] = await knex("notes").insert({
        title,
        description,
        rating,
        user_id: user_id
    }).returning("*");

    if (!note) {
      return response.status(500).json({ error: "Erro ao inserir a nota" });
    }

    await knex("tags").insert({
        name: note.title,
        note_id: note.id,
        user_id
    });

    response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete()

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();

    if (!note) {
      return response.status(404).json({ error: "Nota não encontrada" });
    }

    return response.json(note);
  }
}

module.exports = NotesController