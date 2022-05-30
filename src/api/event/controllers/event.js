"use strict";

/**
 *  event controller
 * https://docs.strapi.io/developer-docs/latest/guides/is-owner.html
 */

//second parameter of createCoreController is meant for /event/me route to get all events linked to the current user.

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  //Create event with Linked User----------------------------------------
  async create(ctx) {
    let entity;
    ctx.request.body.data.user = ctx.state.user;
    entity = await super.create(ctx);
    return entity;
  },

  // Update user event - working for strapiV4----------------------------------------
  async update(ctx) {
    let entity;
    //id of event
    const { id } = ctx.params;
    const query = {
      filters: {
        id: id,
        user: { id: ctx.state.user.id },
      },
    };

    const events = await this.find({ query: query });

    // console.log("events:", events, "ctx:", ctx);

    if (!events.data || !events.data.length) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    entity = await super.update(ctx);
    return entity;
  },

  // Delete a user event----------------------------------------
  async delete(ctx) {
    const { id } = ctx.params;
    const query = {
      filters: {
        id: id,
        user: { id: ctx.state.user.id },
      },
    };
    const events = await this.find({ query: query });
    if (!events.data || !events.data.length) {
      return ctx.unauthorized(`You can't delete this entry`);
    }
    const response = await super.delete(ctx);
    return response;
  },

  //Get logged in users --> Working for strapiV4----------------------------------------
  async me(ctx) {
    const user = ctx.state.user;

    //condition if the user is not authorized/registered
    if (!user) {
      return ctx.badRequest(null, [
        { messages: "No authorization header was found" },
      ]);
    }

    //query database
    const data = await strapi.db.query("api::event.event").findMany({
      where: {
        user: { id: user.id },
      },
      populate: { user: true, image: true },
    });

    //if no data is returned by the above request
    if (!data) {
      return ctx.notFound();
    }

    //return sanitized response
    const res = await this.sanitizeOutput(data, ctx);
    return res;
  },
}));
