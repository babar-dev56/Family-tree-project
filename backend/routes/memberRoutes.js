const express = require("express");
const MemberController = require("../controllers/memberController");

const router = express.Router();

// CREATE
router.post("/", MemberController.addMember);

// READ ALL
router.get("/", MemberController.getAllMembers);

// FAMILY TREE ROUTES (put these before "/:id")
router.get("/:id/family", MemberController.getMemberWithFamily);
router.get( "/:id/family-tree", MemberController.getFamilyTree);
router.get("/:id/children", MemberController.getChildren);
router.get("/:id/parent", MemberController.getParent);
router.get("/:id/siblings", MemberController.getSiblings);
router.get("/:id/grandchildren", MemberController.getGrandChildren);

// GENERIC CRUD ROUTES (keep these last)
router.get("/:id", MemberController.getMemberById);
router.put("/:id", MemberController.updateMember);
router.delete("/:id", MemberController.deleteMember);

module.exports = router;