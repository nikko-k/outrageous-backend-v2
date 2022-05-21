import { DataTypes, Sequelize } from "sequelize";

export default (sequelize:Sequelize) => {
    sequelize.define('user',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique:true,
            },
            password: {
                type: DataTypes.STRING,
            },
            firstname: {
                allowNull: false,
                type: DataTypes.STRING
            },
			garageID: {
				allowNull: true,
				type: DataTypes.STRING,
			},
            lastname: {
                type: DataTypes.STRING
            },
            facebookID: {
                type: DataTypes.STRING,
            }
        });
    return sequelize;
}