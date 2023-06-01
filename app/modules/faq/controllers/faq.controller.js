const express = require("express");
const mongoose = require("mongoose");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const faqRepo = require("faq/repositories/faq.repository");

class faqController {
  constructor() { }

  /* @Method: list
  // @Description: View for all the faq from DB
  */
  async list(req, res) {
    try {
      res.render("faq/views/list.ejs", {
        page_name: "faq-management",
        page_title: "FAQ List",
        user: req.user
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /*
  // @Method: create
  // @Description:  faq create page
  */
  async create(req, res) {
    try {
      
      res.render("faq/views/add.ejs", {
        page_name: "faq-management",
        page_title: "FAQ Create",
        user: req.user        
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /*
  // @Method: insert
  // @Description:  Insert faq into DB
  */
  async insert(req, res) {
    try {

      let savefaq = await faqRepo.save(req.body);
      req.flash("success", "FAQ added successfully.");
      res.redirect(namedRouter.urlFor("faq.list"));

    } catch (e) {      
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("FAQ.create"));
    }
  };

  /* @Method: update
  // @Description: faq update action
  */
  async update(req, res) {
    try {

      const faqId = req.body.id;

      let faqUpdate = await faqRepo.updateById(faqId, req.body);
      if (faqUpdate) {
        req.flash("success", "faq Updated Successfully");
        res.redirect(namedRouter.urlFor("faq.list"));
      } else {
        res.redirect(
          namedRouter.urlFor("faq.edit", {
            id: faqId
          })
        );
      }

    } catch (e) {
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("faq.edit", {
        id: faqId
      }));
    }
  };

  /* @Method: getAll
  // @Description: To get all the faq from DB
  */
  async getAll(req, res) {
    try {
      let faqData = await faqRepo.getAll(req);
      if (_.has(req.body, "sort")) {
        var sortOrder = req.body.sort.sort;
        var sortField = req.body.sort.field;
      } else {
        var sortOrder = -1;
        var sortField = "_id";
      }
      let meta = {
        page: req.body.pagination.page,
        pages: faqData.pages,
        perpage: req.body.pagination.perpage,
        total: faqData.total,
        sort: sortOrder,
        field: sortField,
      };

      return {
        status: 200,
        meta: meta,
        data: faqData.docs,
        message: `Data fetched successfully.`,
      };
    } catch (e) {
      throw e;
    }
  };

  /*
  // @Method: edit
  // @Description:  faq edit page
  */
  async edit(req, res) {
    try {
      
      let mtInfo = await faqRepo.getById(req.params.id);
      if (!_.isEmpty(mtInfo)) {
        res.render("faq/views/edit.ejs", {
          page_name: "faq-management",
          page_title: "FAQ Edit",
          user: req.user,
          response: mtInfo
        });
      } else {
        req.flash("error", "Sorry, record not found!");
        res.redirect(namedRouter.urlFor("faq.list"));
      }
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /* @Method: delete
  // @Description: faq delete action
  */
  async delete(req, res) {
    try {

      let mtDelete = await faqRepo.updateById(req.params.id, {
        isDeleted: true,
      });
      req.flash("success", "FAQ removed successfully");
      res.redirect(namedRouter.urlFor("faq.list"));

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };

  /*
  // @Method: statusChange
  // @Description: faq status change action
  */
  async statusChange(req, res) {
    try {


      let faqInfo = await faqRepo.getById(req.params.id);

      if (!_.isEmpty(faqInfo)) {
        let faqStatus =
          faqInfo.status == "Active" ? "Inactive" : "Active";
        let faqUpdate = faqRepo.updateById(req.params.id, {
          status: faqStatus,
        });

        req.flash("success", "FAQ status has changed successfully");
        res.redirect(namedRouter.urlFor("faq.list"));
      }

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };

};

module.exports = new faqController();