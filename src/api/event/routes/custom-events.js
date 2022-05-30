"use strict";

/**
 * custom router.
 */

//The purpose of this custom route is to get specific events for a certain user only
//if we hit this route we can get all relevant events linked to the current user that is logged in
//this will add a new event role permission, make sure to check it on strapi dashboard

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/events/me",
      handler: "event.me",
      config: {},
    },
  ],
};
