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
            title: {
                allowNull: false,
                type: DataTypes.STRING
            },
			content: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			pictureIDS: {
				allowNull: true,
				type: DataTypes.STRING
			}
        });

    return sequelize;
}