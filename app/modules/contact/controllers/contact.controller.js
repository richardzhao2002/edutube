const express = require("express");
const mongoose = require("mongoose");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const contactRepo = require("contact/repositories/contact.repository");
const csvtojsonV2 = require("csvtojson");
const CsvParser = require("json2csv").Parser;
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

class contactController {
  constructor() { }

  /**
   * @Document: Render Upload CSV File Page 
   */
  async upload(req, res) {
    try {
      res.render("contact/views/upload.ejs", {
        page_name: "contact-upload",
        page_title: "Contact Upload",
        user: req.user
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  }

  /**
   * @Method: Upload CSV Page
   * @Description: CSV Upload Handle
   */
  async uploadCsv(req, res) {
    try {
      const jsonObj = await csvtojsonV2()
        .fromFile(req.file.path);

      jsonObj.forEach(obj => {
        if (!_.has(obj, 'name') || !_.has(obj, 'email') || !_.has(obj, 'phone')) {
          req.flash("error", 'CSV contains invalid key values');
          return res.redirect(namedRouter.urlFor("contact.upload"));
        }
      })

      await contactRepo.saveMany(jsonObj);
      req.flash("success", 'Data added to Databse');
      res.redirect(namedRouter.urlFor("contact.list"));

    } catch (err) {
      throw err;
    }
  }

  /**
    * @Method: Download CSV
    * @Description: PDF Downlaod From DB
    */
  async contactDownloadPDF(req, res) {
    try {
      const response = await contactRepo.getAllByField({ isDeleted: { $eq: false }, status: { $eq: 'Active' } });
      const doc = new jsPDF()
      var col = ['Name', 'Email', 'Phone'];
      var rows = [];

      response.forEach(element => {
        var tempArr = [element.name, element.email, element.phone];
        rows.push(tempArr);
      })
      doc.autoTable(col, rows);
      res.contentType('application/pdf');
      let outputPDF = doc.output()
      res.status(200)
        .set({ 'content-type': 'application/pdf; charset=utf-8' })
        .send(outputPDF)
    } catch (err) {
      throw err
    }
  }

  /**
   * @Method: Download CSV
   * @Description: CSV Downlaod From DB
   */

  async contactDownload(req, res) {
    try {
      const response = await contactRepo.getAllByField({ isDeleted: { $eq: false }, status: { $eq: 'Active' } });
      if (!response.length > 0) {
        req.flash("error", 'No data to downlaod');
        return res.redirect(namedRouter.urlFor("contact.list"));
      }
      let contactArray = [];
      response.forEach((obj) => {
        const { name, email, phone } = obj;
        contactArray.push({ name, email, phone });
      })
      const csvFields = ["_id", "Question", "Answer"];
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(contactArray);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
      res.status(200).end(csvData);
    } catch (err) {
      throw err;
    }
  }


  /* @Method: list
 //  @Description: View for all the Contacts from DB
 */
  async list(req, res) {
    try {
      res.render("contact/views/list.ejs", {
        page_name: "contact-details",
        page_title: "Contact List",
        user: req.user
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  }

  /*
  // @Method: create
  // @Description:  contact create page
  */
  async create(req, res) {
    try {

      res.render("contact/views/add.ejs", {
        page_name: "contact-details",
        page_title: "Contact Create",
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
  // @Description:  Insert Contact into DB
  */
  async insert(req, res) {
    try {

      let emailExists = await contactRepo.getByField({
        email: new RegExp(`^${req.body.email.trim()}$`, 'i'),
        phone: req.body.phone,
        isDeleted: false
      });

      if (!_.isEmpty(emailExists)) {
        req.flash('error', 'Email Id & phone already exists.');
        return res.redirect(namedRouter.urlFor('contact.create'));
      }

      let saveContact = await contactRepo.save(req.body);
      req.flash("success", "Contact added successfully.");
      res.redirect(namedRouter.urlFor("contact.list"));

    } catch (e) {
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("contact.create"));
    }
  };

  /* @Method: update
    // @Description: Contact update action
    */
  async update(req, res) {
    const contactId = req.body.id;
    try {
      let contactUpdate = await contactRepo.updateById(contactId, req.body);
      if (contactUpdate) {
        req.flash("success", "Contact Updated Successfully");
        res.redirect(namedRouter.urlFor("contact.list"));
      } else {
        res.redirect(
          namedRouter.urlFor("contact.edit", {
            id: contactId
          })
        );
      }

    } catch (e) {
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("contact.edit", {
        id: contactId
      }));
    }
  };


  /* @Method: getAll
  // @Description: To get all the contact from DB
  */
  async getAll(req, res) {
    try {
      let contactData = await contactRepo.getAllContacts(req);
      if (_.has(req.body, "sort")) {
        var sortOrder = req.body.sort.sort;
        var sortField = req.body.sort.field;
      } else {
        var sortOrder = -1;
        var sortField = "_id";
      }
      let meta = {
        page: req.body.pagination.page,
        pages: contactData.pages,
        perpage: req.body.pagination.perpage,
        total: contactData.total,
        sort: sortOrder,
        field: sortField,
      };

      return {
        status: 200,
        meta: meta,
        data: contactData.docs,
        message: `Data fetched successfully.`,
      };
    } catch (e) {
      throw e;
    }
  };

  /*
  // @Method: edit
  // @Description:  contact edit page
  */
  async edit(req, res) {
    try {

      let mtInfo = await contactRepo.getById(req.params.id);
      if (!_.isEmpty(mtInfo)) {
        res.render("contact/views/edit.ejs", {
          page_name: "contact-details",
          page_title: "Contact Edit",
          user: req.user,
          response: mtInfo
        });
      } else {
        req.flash("error", "Sorry, record not found!");
        res.redirect(namedRouter.urlFor("contact.list"));
      }
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /* @Method: delete
  // @Description: contact delete action
  */
  async delete(req, res) {
    try {

      let mtDelete = await contactRepo.updateById(req.params.id, {
        isDeleted: true,
      });
      req.flash("success", "Contact removed successfully");
      res.redirect(namedRouter.urlFor("contact.list"));

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };


  /*
  // @Method: statusChange
  // @Description: Contact status change action
  */
  async statusChange(req, res) {
    try {
      let contactInfo = await contactRepo.getById(req.params.id);

      if (!_.isEmpty(contactInfo)) {
        let contactStatus =
          contactInfo.status == "Active" ? "Inactive" : "Active";
        let contactUpdate = contactRepo.updateById(req.params.id, {
          status: contactStatus,
        });

        req.flash("success", "Contact status has changed successfully");
        res.redirect(namedRouter.urlFor("contact.list"));
      }

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };
}

module.exports = new contactController();