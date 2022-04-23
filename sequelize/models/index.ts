import { Sequelize } from "sequelize/types";

import user from "./user.model";
import session from "./sessions.model";

// Defines models to sequelize instance
const models = (sequelize: Sequelize):void  => {
    user(sequelize);
    session(sequelize);
}

export default models;