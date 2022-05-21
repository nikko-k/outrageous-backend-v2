import { DataTypes, Sequelize } from "sequelize";

export default (sequelize:Sequelize) => {
    sequelize.define('session',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userID: {
                allowNull: false,
                type: DataTypes.STRING
            },
			carIDS: {
				allowNull: true,
				type: DataTypes.STRING,
			}
        });

    return sequelize;
}