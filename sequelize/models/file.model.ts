import { DataTypes, Sequelize } from "sequelize";

export default (sequelize:Sequelize) => {
    sequelize.define('file',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
			filename: {
				allowNull: false,
				type: DataTypes.STRING
			},
			originalname: {
				allowNull: false,
				type: DataTypes.STRING
			},
			filepath: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			ispicture: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
			},
			owner: {
				allowNull: true,
				defaultValue: null,
				type: DataTypes.STRING
			}
        });

    return sequelize;
}