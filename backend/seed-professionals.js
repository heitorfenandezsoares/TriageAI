import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const profissionais = [
  {
    nome: 'Enfermeira Ana Clara',
    email: 'enfermeiro@triageai.com',
    senha: 'Enfermeiro@123',
    perfil: 'enfermeiro',
  },
  {
    nome: 'Dr. Roberto Gestor',
    email: 'gestor@triageai.com',
    senha: 'Gestor@123',
    perfil: 'gestor',
  },
  {
    nome: 'Recepção Carlos Eduardo',
    email: 'recepcao@triageai.com',
    senha: 'Recepcao@123',
    perfil: 'recepcionista',
  },
];

async function seedInDatabase(conn, dbName) {
  console.log(`\nInserindo profissionais no banco de dados '${dbName}'...`);
  await conn.query(`USE \`${dbName}\`;`);

  // Garante que a tabela users_professionals existe
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users_professionals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      senhaHash VARCHAR(255) NOT NULL,
      nome VARCHAR(255) NOT NULL,
      perfil VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB;
  `);

  // Garante também a tabela users
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      senhaHash VARCHAR(255) NOT NULL,
      nome VARCHAR(255) NOT NULL,
      perfil VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB;
  `);

  for (const prof of profissionais) {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(prof.senha, salt);

    // 1. Popula users_professionals
    const [rowsProf] = await conn.query('SELECT id FROM users_professionals WHERE email = ?', [prof.email]);
    if (rowsProf.length > 0) {
      await conn.query(
        'UPDATE users_professionals SET senhaHash = ?, nome = ?, perfil = ? WHERE email = ?',
        [senhaHash, prof.nome, prof.perfil, prof.email]
      );
      console.log(`✓ Profissional atualizado em users_professionals: ${prof.email} (${prof.perfil})`);
    } else {
      await conn.query(
        'INSERT INTO users_professionals (email, senhaHash, nome, perfil) VALUES (?, ?, ?, ?)',
        [prof.email, senhaHash, prof.nome, prof.perfil]
      );
      console.log(`✓ Profissional criado em users_professionals: ${prof.email} (${prof.perfil})`);
    }

    // 2. Mantém também em users para redundância
    const [rowsUser] = await conn.query('SELECT id FROM users WHERE email = ?', [prof.email]);
    if (rowsUser.length > 0) {
      await conn.query(
        'UPDATE users SET senhaHash = ?, nome = ?, perfil = ? WHERE email = ?',
        [senhaHash, prof.nome, prof.perfil, prof.email]
      );
    } else {
      await conn.query(
        'INSERT INTO users (email, senhaHash, nome, perfil) VALUES (?, ?, ?, ?)',
        [prof.email, senhaHash, prof.nome, prof.perfil]
      );
    }
  }
}

async function main() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'robson1789',
    });

    console.log('Conectado ao MySQL como root com sucesso!');

    // Configura usuário u103807666_root se necessário
    try {
      await conn.query("CREATE USER IF NOT EXISTS 'u103807666_root'@'localhost' IDENTIFIED BY 'Robson1789';");
      await conn.query("ALTER USER 'u103807666_root'@'localhost' IDENTIFIED BY 'Robson1789';");
      await conn.query("GRANT ALL PRIVILEGES ON *.* TO 'u103807666_root'@'localhost' WITH GRANT OPTION;");
      await conn.query("CREATE DATABASE IF NOT EXISTS u103807666_tcc;");
      await conn.query("FLUSH PRIVILEGES;");
    } catch (e) {
      console.warn('Nota permissões:', e.message);
    }

    // 1. Popula 'tcc'
    await seedInDatabase(conn, 'tcc');

    // 2. Popula 'u103807666_tcc'
    await seedInDatabase(conn, 'u103807666_tcc');

    // Exibe profissionais de users_professionals
    const [usuarios] = await conn.query('SELECT id, email, nome, perfil FROM users_professionals');
    console.log('\nProfissionais cadastrados em users_professionals:');
    console.table(usuarios);

    await conn.end();
    console.log('\nSeed finalizado com sucesso!');
  } catch (err) {
    console.error('Erro na execução:', err);
    process.exit(1);
  }
}

main();
