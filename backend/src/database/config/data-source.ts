import 'dotenv/config'
import { DataSource, DataSourceOptions } from 'typeorm'

// Note: This is a separate configuration for the TypeORM CLI.
// It reads the same environment variables as your main application.
// The paths for entities and migrations are relative to the 'backend' directory.

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // IMPORTANT: Always set to false when using migrations
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
