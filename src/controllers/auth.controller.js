const Usuario = require("../models/Usuario");

const
    CLIENT_ID = '367337669931-s6d728je9j4p0nkq11u8r53s2an0hdeo.apps.googleusercontent.com',
    { OAuth2Client } = require( 'google-auth-library' ),
    client = new OAuth2Client( CLIENT_ID );

/** Crea nuevo recurso */
exports.googleLogin = async (request, response) => {
    const { tokenId } = request .body;
    console.log( 'tokenId: ', tokenId );

    // ! Verify Google TokenID
    const
        ticket = await client .verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID
        }),
        payload = ticket .getPayload(),
        { name, given_name, family_name, picture, email, email_verified } = payload;

    // ! Verificacion de correo
    if( email_verified ) {
        const userFound = await Usuario .findOne({ correo: email });

        // ! Verifica si el usuario encontrado esta registrado
        if( ! userFound ) {
            console.info( `Este usuario no existe, registrate primero.` );
            return response .json({
                error: {
                    mensaje: `Este usuario no existe, registrate primero.`
                }
            })}
        }

};