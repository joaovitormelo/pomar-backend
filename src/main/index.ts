"use strict";
process.env.TZ = "UTC";
require("dotenv").config();

import { Initializer } from "./setup/initializer";

new Initializer().init();

console.log("Backend Running at port " + process.env.PORT + "!");
