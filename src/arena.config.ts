import Arena from "@colyseus/arena";
import {monitor} from "@colyseus/monitor";

/**
 * Import your Room files
 */
import {PetitelaineRoom} from "./rooms/PetitelaineRoom";

export default Arena({
	getId: () => "Your Colyseus App",

	initializeGameServer: (gameServer) => {
		/**
		 * Define your room handlers:
		 */
		gameServer.define("petitelaine", PetitelaineRoom).enableRealtimeListing();
	},

	initializeExpress: (app) => {
		/**
		 * Bind your custom express routes here:
		 */
		// app.get("/", (req, res) => {
		// 	res.send("It's time to kick ass and chew bubblegum!");
		// });

		/**
		 * Bind @colyseus/monitor
		 * It is recommended to protect this route with a password.
		 * Read more: https://docs.colyseus.io/tools/monitor/
		 */
		// app.use("/colyseus", monitor());
	},

	beforeListen: () => {
		/**
		 * Before before gameServer.listen() is called.
		 */
	},
});
