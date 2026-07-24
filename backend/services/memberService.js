const db = require("../db");
const Member = require("../models/Member");

class MemberService {
    // Get all members
    static async getAllMembers() {
        try {
            return await db("members").select("*");
        } catch (error) {
            throw new Error(`Error fetching members: ${error.message}`);
        }
    }

    // Get member by ID
    static async getMemberById(id) {
        try {
            return await db("members")
                .where({ id })
                .first();
        } catch (error) {
            throw new Error(`Error fetching member: ${error.message}`);
        }
    }

    // Add member
    static async addMember(memberData) {
        try {
            const { name, age, gender, parent_id } = memberData;

            const result = await Member.query().insert({
                name,
                age,
                gender,
                parent_id: parent_id || null
            });

            return result;
        } catch (error) {
            throw new Error(`Error adding member: ${error.message}`);
        }
    }

    // Update member
    static async updateMember(id, memberData) {
        try {
            return await db("members")
                .where({ id })
                .update(memberData);
        } catch (error) {
            throw new Error(`Error updating member: ${error.message}`);
        }
    }

    // Delete member
    static async deleteMember(id) {
        try {
            return await db("members")
                .where({ id })
                .delete();
        } catch (error) {
            throw new Error(`Error deleting member: ${error.message}`);
        }
    }

    // Get children
    static async getChildren(parentId) {
        return await db("members")
            .where({ parent_id: parentId });
    }

    // Get siblings
    static async getSiblings(memberId) {
        const member = await db("members")
            .where({ id: memberId })
            .first();

        if (!member) {
            throw new Error("Member not found");
        }

        if (!member.parent_id) {
            return [];
        }

        return await db("members")
            .where({ parent_id: member.parent_id })
            .whereNot({ id: memberId });
    }

    // Get grandchildren
    static async getGrandChildren(memberId) {
        return await db("members")
            .whereIn(
                "parent_id",
                db("members")
                    .select("id")
                    .where({ parent_id: memberId })
            );
    }

    // Get parent
    static async getParent(memberId) {
        const member = await db("members")
            .where({ id: memberId })
            .first();

        if (!member) {
            throw new Error("Member not found");
        }

        if (!member.parent_id) {
            return null;
        }

        return await db("members")
            .where({ id: member.parent_id })
            .first();
    }

    // Get parent and children
    static async getMemberWithFamily(id) {
        return await Member.query()
            .findById(id)
            .withGraphFetched("[parent, children]");
    }
 

    // Get complete family tree recursively
    static async getFamilyTree(memberId) {

        const member = await db("members")
            .where({ id: memberId })
            .first();

        if (!member) {
            return null;
        }

        const children = await db("members")
            .where({ parent_id: memberId });

        member.children = [];

        for (const child of children) {
            const childTree =
                await this.getFamilyTree(child.id);

            member.children.push(childTree);
        }

        return member;
    }
}

module.exports = MemberService;