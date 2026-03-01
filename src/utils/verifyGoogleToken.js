const verifyGoogleToken = async (client, token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Invalid Google token");
    }

    return payload;
};

module.exports = verifyGoogleToken;