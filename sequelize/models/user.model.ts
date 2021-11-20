import { DataTypes, Sequelize } from "sequelize/types";

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
                type: DataTypes.STRING
            },
            firstname: {
                type: DataTypes.STRING
            },
            lastname: {
                type: DataTypes.STRING
            },
            facebookID: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
              },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        }
    )
}