import { Sequelize } from "sequelize/types";

import user from "./user.model";
import session from "./sessions.model";
import car from "./car.model";
import garage from "./garage.model";
import post from "./post.model";
import file from "./file.model";

// Defines models to sequelize instance
const models = (sequelize: Sequelize):void  => {
    user(sequelize);
    session(sequelize);
	car(sequelize);
	garage(sequelize);
	post(sequelize);
	file(sequelize);
}

export default models;