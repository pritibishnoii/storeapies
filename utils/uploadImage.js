import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async ( file, folder, quality ) => {
  const options = { folder }
  if ( quality ) {
    options.quality = quality
  }
  options.resource_type = "auto"
  console.log( "OPTIONS", options )
  return await cloudinary.uploader.upload( file.tempFilePath, options )
}



// import { v2 as cloudinary } from "cloudinary";

// export const uploadImageToCloudinary = async ( file, folder, quality ) => {
//   const options = { folder }
//   if ( quality ) {
//     options.quality = quality
//   }
//   options.resource_type = "auto"
//   console.log( "OPTIONS", options )
//   return await cloudinary.uploader.upload( file.tempFilePath, options )
// }
