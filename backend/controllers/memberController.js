const Joi = require("joi");
const MemberService = require("../services/memberService");

const createMemberSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    age: Joi.number().integer().min(0).max(150).allow(null).optional(),
    gender: Joi.string().trim().lowercase().valid("male", "female", "other").required(),
    parent_id: Joi.number().integer().positive().allow(null).optional(),
    notes: Joi.string().allow(null, "").optional().strip()
}).unknown(false);

const updateMemberSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    age: Joi.number().integer().min(0).max(150).allow(null).optional(),
    gender: Joi.string().trim().lowercase().valid("male", "female", "other").optional(),
    parent_id: Joi.number().integer().positive().allow(null).optional(),
    notes: Joi.string().allow(null, "").optional().strip()
}).min(1).unknown(false);

class MemberController {
    static sendValidationError(res, errors) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    static validateCreateMember(req, res) {
        const { value, error } = createMemberSchema.validate(req.body || {}, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error) {
            MemberController.sendValidationError(
                res,
                error.details.map((detail) => detail.message)
            );
            return false;
        }

        req.body = value;
        return true;
    }

    static validateUpdateMember(req, res) {
        const { value, error } = updateMemberSchema.validate(req.body || {}, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error) {
            MemberController.sendValidationError(
                res,
                error.details.map((detail) => detail.message)
            );
            return false;
        }

        req.body = value;
        return true;
    }

    static validateMemberId(req, res) {
        const idValue = Number(req.params.id);

        const { error } = Joi.number()
            .integer()
            .positive()
            .required()
            .validate(idValue);

        if (error) {
            MemberController.sendValidationError(
                res,
                ["id must be a positive integer"]
            );
            return false;
        }

        req.params.id = idValue;
        return true;
    }

    // GET /members
    static async getAllMembers(req, res) {
        try {
            const members = await MemberService.getAllMembers();

            res.status(200).json({
                success: true,
                data: members
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id
    static async getMemberById(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const member = await MemberService.getMemberById(
                req.params.id
            );

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            res.status(200).json({
                success: true,
                data: member
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /members
    static async addMember(req, res) {
        try {
            if (!MemberController.validateCreateMember(req, res)) {
                return;
            }

            const member = await MemberService.addMember(req.body);

            res.status(201).json({
                success: true,
                message: "Member added successfully",
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /members/:id
    static async updateMember(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            if (!MemberController.validateUpdateMember(req, res)) {
                return;
            }

            const updated = await MemberService.updateMember(
                req.params.id,
                req.body
            );

            if (updated === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Member updated successfully"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /members/:id
    static async deleteMember(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const deleted = await MemberService.deleteMember(
                req.params.id
            );

            if (deleted === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Member deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id/children
    static async getChildren(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const children =
                await MemberService.getChildren(req.params.id);

            res.status(200).json({
                success: true,
                data: children
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id/parent
    static async getParent(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const parent =
                await MemberService.getParent(req.params.id);

            res.status(200).json({
                success: true,
                data: parent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id/family
    static async getMemberWithFamily(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const member =
                await MemberService.getMemberWithFamily(
                    req.params.id
                );

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            res.status(200).json({
                success: true,
                data: member
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id/siblings
    static async getSiblings(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const siblings =
                await MemberService.getSiblings(req.params.id);

            res.status(200).json({
                success: true,
                data: siblings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id/grandchildren
    static async getGrandChildren(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const grandChildren =
                await MemberService.getGrandChildren(
                    req.params.id
                );

            res.status(200).json({
                success: true,
                data: grandChildren
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /members/:id/tree
    static async getFamilyTree(req, res) {
        try {
            if (!MemberController.validateMemberId(req, res)) {
                return;
            }

            const tree =
                await MemberService.getFamilyTree(
                    req.params.id
                );

            if (!tree) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            res.status(200).json({
                success: true,
                data: tree
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}


module.exports = MemberController;