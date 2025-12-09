import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Sube un PDF a Cloudinary
 * @param {string} filePath - Ruta local del archivo PDF
 * @param {string} publicId - ID público para el archivo en Cloudinary
 * @returns {Promise<Object>} - Resultado de la subida con URL segura
 */
export const uploadPDFToCloudinary = async (filePath, publicId) => {
  try {
    console.log('📤 Subiendo PDF a Cloudinary:', filePath);
    
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw', // Para PDFs y otros documentos
      public_id: publicId,
      folder: 'fichas_mantenimiento', // Carpeta en Cloudinary
      overwrite: true,
      // NO especificar type para que sea público por defecto
    });

    console.log('✅ PDF subido exitosamente a Cloudinary');
    console.log('📎 Public ID:', result.public_id);
    console.log('📎 URL pública:', result.secure_url);

    // Eliminar archivo local después de subirlo
    try {
      fs.unlinkSync(filePath);
      console.log('🗑️  Archivo local eliminado:', filePath);
    } catch (unlinkError) {
      console.warn('⚠️  No se pudo eliminar archivo local:', unlinkError.message);
    }

    return {
      url: result.secure_url, // URL pública directa
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('❌ Error al subir PDF a Cloudinary:', error);
    throw error;
  }
};

/**
 * Genera una nueva URL firmada para un archivo existente en Cloudinary
 * @param {string} publicId - ID público del archivo
 * @returns {string} - URL firmada válida por 24 horas
 */
export const getSignedUrl = (publicId) => {
  return cloudinary.utils.private_download_url(
    publicId,
    'pdf',
    {
      resource_type: 'raw',
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
    }
  );
};

/**
 * Elimina un archivo de Cloudinary
 * @param {string} publicId - ID público del archivo en Cloudinary
 */
export const deletePDFFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
      // No especificar type
    });
    console.log('🗑️  PDF eliminado de Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Error al eliminar PDF de Cloudinary:', error);
    throw error;
  }
};
