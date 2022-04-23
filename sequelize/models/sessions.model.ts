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
            createdAt: {
                allowNull:false,
                type: DataTypes.DATE,
            },
            validForDays: {
                type: DataTypes.INTEGER,
                defaultValue: 30,
            }
        });

    return sequelize;
}