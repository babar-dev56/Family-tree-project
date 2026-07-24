const { Model } = require("objection");

class Member extends Model {
    static get tableName() {
        return "members";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name"],
            properties: {
                id: { type: "integer" },
                name: { type: "string" },
                age: { type: "integer" },
                gender: { type: "string" },
                parent_id: { type: ["integer", "null"] },
                created_at: { type: "string" },
                updated_at: { type: "string" }
            }
        };
    }

    static get relationMappings() {
        const Member = require("./Member");

        return {
            parent: {
                relation: Model.BelongsToOneRelation,
                modelClass: Member,
                join: {
                    from: "members.parent_id",
                    to: "members.id"
                }
            },

            children: {
                relation: Model.HasManyRelation,
                modelClass: Member,
                join: {
                    from: "members.id",
                    to: "members.parent_id"
                }
            }
        };
    }
}

module.exports = Member;