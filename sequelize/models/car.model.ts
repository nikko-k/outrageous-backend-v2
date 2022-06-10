import { DataTypes, Sequelize } from "sequelize";

export default (sequelize:Sequelize) => {
    sequelize.define('car',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
			year: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
            make: {
                allowNull: false,
                type: DataTypes.STRING
            },
            model: {
                allowNull:false,
                type: DataTypes.DATE,
            },
			displacement: {
				allowNull: true,
				type: DataTypes.INTEGER
			},
			stockPower: {
				allowNull: true,
				type: DataTypes.INTEGER
			},
			power: {
				allowNull: true,
				type: DataTypes.INTEGER
			},
			mods: {
				allowNull: true,
				type: DataTypes.STRING,
			}
        });

    return sequelize;
}