import { DataTypes, Model } from "sequelize";
import sequelizeClient from "./db";

// Interface Section -------------------------------------------------------------------------------------------------------------------

interface PurchaseAttributes {
  id?: number;
  userId: number;
  userEmail: string;
  amount: number;
  orderId: string;  
  orderIdMercadoPago?: string;
  productId?: string;
  transactionId?: string;
  paymentStatus: string;
  paymentUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Purchases extends Model<PurchaseAttributes> implements PurchaseAttributes {
  declare id?: number;
  declare userId: number;
  declare userEmail: string;
  declare amount: number;
  declare orderId: string;  
  declare orderIdMercadoPago?: string;
  declare productId?: string;
  declare transactionId?: string;
  declare paymentStatus: string;
  declare paymentUrl?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

interface UserAttributes {
    id?: number;
    name?: string;
    email: string;
    address?: string;
    telephone?: string;
    paymentStatus?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare address: string;
  declare telephone: string;
  declare paymentStatus: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

interface AuthAttributes {
  id?: number;
  userId: number;
  code: string;
  expiration: Date;
}

export class Auth extends Model<AuthAttributes> implements AuthAttributes {
  declare id: number;
  declare userId: number;
  declare code: string;
  declare expiration: Date;
}

//--------------------------------------------------------------------------------------------------------------------------------------

// Tables Section -------------------------------------------------------------------------------------------------------------------


Purchases.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // tabla users
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
      userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderIdMercadoPago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    },
    paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // pending, approved, cancelled, etc.
  },
  paymentUrl: {
  type: DataTypes.STRING,
  allowNull: true,
  },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeClient,
    modelName: "Purchases",
    tableName: "purchases",
    timestamps: true,
  }
)

//--------------------------------------------------------------------------------------------------------------------------------------

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize: sequelizeClient,
    modelName: "User",  
    tableName: "ecommerce_users",
    timestamps: true,
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------

Auth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeClient,
    modelName: 'Auth',
    tableName: "ecommerce_auths",
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------

// Relaciones

// ✅ Función para definir relaciones (se llama después)
function setupAssociations() {
  User.hasMany(Purchases, { foreignKey: 'userId', as: 'purchases' });
  Purchases.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasOne(Auth, { foreignKey: 'userId' });
  Auth.belongsTo(User, { foreignKey: 'userId' });
}

// ✅ Llamar a las relaciones
setupAssociations();

//--------------------------------------------------------------------------------------------------------------------------------------

// Sync Section ------------------------------------------------------------------------------------------------------------------------

// ✅ Solo exportá la función, NO la ejecutes automáticamente
// models.ts
let syncPromise: Promise<void> | null = null;

export async function syncDatabase() {
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      await sequelizeClient.sync({ force: true });
      console.log("✅ Tablas sincronizadas");
    } catch (error) {
      console.error("❌ Error sincronizando tablas:", error);
      syncPromise = null;
      throw error;
    }
  })();

  return syncPromise;
}

    await syncDatabase();
//--------------------------------------------------------------------------------------------------------------------------------------


























































