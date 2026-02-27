import type { NextApiRequest, NextApiResponse } from "next";
import { User, Auth } from '../models/models';
import { Op } from "sequelize";
import sendEmail from "../../lib/nodemailer_email";
import { generateToken, verifyToken } from "../../lib/jwt-auth";
import logger from "../../lib/winston-logger";
import parseBearerToken from "parse-bearer-token";


// Controlador para manejar el envío de emails con códigos de autenticación osea /auth con metodo POST


export const sendingEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.email;
  logger.debug(`Solicitud de envío de email recibida para: ${email}`);
  console.log(`Email obtenido: ${email}`);

  // Aquí iría la lógica para buscar/crear el registro en la base de datos
  let user = await User.findOne({ where: { email } });
  // Si el usuario no existe, lo creamos
  if (!user) {
  try {
  user = await User.create({ email });
  logger.debug(`Nuevo usuario creado: ${user.email}`);
  } catch (error) {
  logger.error('Error al crear el usuario:', error);
  return res.status(500).json({ success: false, error: 'Error al crear el usuario' });
  }
}
  
   // Verificar si ya hay un código válido para este usuario
  const existingAuth = await Auth.findOne({
    where: {
      userId: user.id,
      expiration: { [Op.gt]: new Date() }, // que no esté vencido
    },
  });
  logger.debug(`Registro de autenticación existente: ${existingAuth}`);
  if (existingAuth) {
    logger.warn(`Ya existe un código activo para el usuario ID: ${user.id}`);
    return res.status(429).json({ success: true, message: 'Ya existe un código activo, revisá tu email' });
  }


  // si no existe va la lógica para generar el código de autenticación
  const code = generateToken(user.id, '15m');
  logger.debug(`Código generado: ${code}`);
  // almacenarlo en la base de datos (tabla Auth)  
  const authRecord = await Auth.create({
    userId: user.id,
    code,
    expiration: new Date(Date.now() + 15 * 60 * 1000), // 15 mins desde ahora
  });
  logger.debug(`Código almacenado en la base de datos para el usuario ID: ${user.id}`, authRecord);
  // Aquí iría la lógica para enviar el email con el código
  // y enviar el código por email.
  await sendEmail(email, 'Tu código de autenticación', `Tu código es: ${code}`);
  logger.debug(`codigo enviado al email: ${email}`);
  // Al final, envías una respuesta
  res.status(200).json({ success: true,  message: "Email procesado correctamente."});
};

// ---------------------------------------------------------------------------------------------

// Controlador para manejar la verificación del código de autenticación osea /auth/token con metodo POST

export const verifyAuthCode = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, code } = req.body;
  logger.debug(`Verificando código para email: ${email} con código: ${code}`);
  // Buscar el usuario por email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    logger.warn(`Usuario no encontrado durante la verificación del código: ${email}`);
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  logger.debug(`Usuario encontrado:${user}`);
  // Buscar el código en la tabla Auth
  const authRecord = await Auth.findOne({
    where: {
      userId: user.id,
      code,
      expiration: { [Op.gt]: new Date() }, // que no esté vencido
    },
  });
  logger.debug(`Registro de autenticación encontrado: ${authRecord}`);
  if (!authRecord) {
    return res.status(400).json({ message: 'Código inválido o expirado' });
  }
  // Si el código es válido, generar un token JWT para el usuario
  const token = generateToken(user.id, '2h');
  logger.debug(`Código verificado. Token generado para el usuario ID: ${user.id}`, token);
  // Enviar el token en la respuesta
  res.status(200).json({ token, email: user.email });
}

// ---------------------------------------------------------------------------------------------

// Controlador para manejar la obtención de la información del usuario en cuestión a travez de una request con un token. Es /me con metodo GET

export const getMe = async (req: NextApiRequest, res: NextApiResponse) => {
  // El middleware de autenticación debería haber agregado el ID del usuario a req.userId
  const token = parseBearerToken(req);
  logger.debug(`Token extraído con parse-bearer-token: ${token}`);

  if (!token) {
    logger.warn(`Token incorrecto o ausente durante la obtención de información del usuario: ${token}`);
    return res.status(401).json({ message: 'Token incorrecto' });
  }

   // Verificar el token
  const tokenData = verifyToken(token);
  logger.debug(`Datos del token verificado: ${tokenData}`);
  if (!tokenData) {
    logger.error(`Token inválido durante la obtención de información del usuario: ${tokenData}`);
    return res.status(401).json({ message: 'Token inválido' });
  }
  if (!tokenData || typeof tokenData === 'string') {
    throw new Error("Token inválido");
  }
   // Obtener el userId del token verificado
  const userId = tokenData.id;
  logger.debug(`Token verificado para el usuario ID: ${userId}`);
  // Buscar el usuario en la base de datos
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'createdAt', 'updatedAt'], // Seleccionar solo los campos necesarios
  });

  if (!user) {
    logger.error(`Usuario no encontrado: ${user}`);
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  logger.debug(`Información del usuario encontrada: ${user}`);
  // Enviar la información del usuario en la respuesta
  res.status(200).json({ user });
}

// ---------------------------------------------------------------------------------------------

// Controlador para modificar algunos datos del usuario al que pertenezca el token. Es /me con metodo PATCH

export const updateMe = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = parseBearerToken(req);
  logger.debug(`Token extraído con parse-bearer-token: ${token}`);
  if (!token) {
    logger.warn(`Token incorrecto o ausente durante la actualización del usuario: ${token}`);
    return res.status(401).json({ message: 'Token incorrecto' });
  }
    // Verificar el token
  const tokenData = verifyToken(token);
  logger.debug(`Datos del token verificado: ${tokenData}`);
  if (!tokenData) {
    logger.error(`Token inválido durante la actualización del usuario: ${tokenData}`);
    return res.status(401).json({ message: 'Token inválido' });
  }
  if (!tokenData || typeof tokenData === 'string') {
    throw new Error("Token inválido");
  }
   // Obtener el userId del token verificado
  const userId = tokenData.id;
  logger.debug(`Token verificado para el usuario ID: ${userId}`);
  // Buscar el usuario en la base de datos
  const user = await User.findByPk(userId);
  if (!user) {
    logger.error(`Usuario no encontrado: ${user} y su id: ${userId}`);
    return res.status(404).json({ message: `Usuario no encontrado: ${user} y su id: ${userId}` });
  }
  logger.debug(`Usuario encontrado para actualización: ${user}`);
  // Actualizar los datos del usuario (por ejemplo, el nombre)
  const { name, email, address } = req.body;
  const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

if (email && !isValidEmail(email)) {
  logger.warn(`Intento de actualización con email inválido: ${email}`);
  return res.status(400).json({ message: 'Email inválido' });
}

  if (name) user.name = name;
  if (email && isValidEmail(email)) user.email = email;
  // Si hay un campo de dirección, actualizalo
  if (address) {
  user.address = address; // Asegúrate de que 'address' esté definido en tu modelo
  }
  await user.save();
  logger.debug(`Usuario actualizado: ${user}`);
  // Enviar la información actualizada del usuario en la respuesta
  res.status(200).json({ user });
}

