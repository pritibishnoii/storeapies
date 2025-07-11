// call database
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
dotenv.config();

// Middleware Setup (IMPORTANT ORDER)
// Configure CORS properly
const corsOptions = {
  origin: [
    'https://storeuiii.vercel.app/',
    'http://localhost:3000' // For local development
  ],
  credentials: true
};

app.use( cors( corsOptions ) );
app.options( '*', cors( corsOptions ) ); // Enable preflight for all routes

app.use( express.json() ); // For JSON bodies
app.use( express.urlencoded( { extended: true } ) ); // For form data
app.use( cookieParser() );


import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

app.get( "/", ( req, res ) => {
  res.send( "Hello World" );
} );
// Handle 404 for API routes
app.use( '/api/*', ( req, res ) => {
  res.status( 404 ).json( { error: "API endpoint not found" } );
} );

// debug;
// app.use((req, res, next) => {
//   console.log(`Incoming ${req.method} request to ${req.path}`);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   next();
// });


// // Database Connection
// connectDB(() => {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT} 🎉`);
//   });
// });


// Connect to database first
connectDB()
  .then( () => {
    const PORT = process.env.PORT || 5000;
    app.listen( PORT, "0.0.0.0", () => {
      console.log( `Server is running at http://localhost:${ PORT } 🎉` );
    } );
  } )
  .catch( ( err ) => {
    console.error( "Database connection failed:", err );
  } );
const __dirname = path.resolve();
// Serve static files from uploads directory
app.use( '/uploads', express.static( path.join( process.cwd(), 'public/uploads' ) ) );



// Routes
app.use( "/api/users", userRoutes );
app.use( "/api/category", categoryRoutes );
app.use( "/api/products", productRoutes );
app.use( "/api/orders", orderRoutes );




export default app;
